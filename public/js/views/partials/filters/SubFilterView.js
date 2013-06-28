define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/SubFilterContainer.html'
], function(Baseview, Utils, Filter, subFilterTemplate){
    var private = {

    };

    var SubFilter = Baseview.extend({
        initialize: function(args) {
            this.isNew = true;
            this.initArgs(args);

            if (!this.model) {
                this.model = new Filter();
            }

            //If anything happens to our operators collection, show the user.
            this.bindTo(this.model, "removeOperator", this.cacheOperators);
            this.bindTo(this.model, "clearOperators", this.reRender);
            this.bindTo(this.model, "addOperator", this.render);

            //Dynamically bound operations based on subfilter level
            //Somewhat faking the event delegation in backbone but it's technically legit
            //Do this on init so I don't need to redelegate events later on
            this.events["click .subFilter-" + this.subFilterLevel] = "showSubFilterUI";
            this.events["click .viewSubFilter-" + this.subFilterLevel] = "showSubFilterUIWithSeed";
            this.events["click #deleteFilter-" + this.subFilterLevel] = "deleteFilter";
            this.events["click #cancelFilter-" + this.subFilterLevel] = "cancelFilter";
            this.events["click #clearFilter-" + this.subFilterLevel] = "clearFilter";
            this.events["click #createFilter-" + this.subFilterLevel] = "createFilter";
            this.events["click #doneFilter-" + this.subFilterLevel] = "doneFilter";
            this.events["click #newLower-" + this.subFilterLevel] = "stopPropagation";
            this.events["click #newUpper-" + this.subFilterLevel] = "stopPropagation";

            this.events["add #" + this.subFilterLevel + "-topLevelBin"] = "addOperatorToTopLevel";
            this.events["click #" + this.subFilterLevel + "-addLogicBin"] = "addBin";
            this.events["click #" + this.subFilterLevel + "-logicalOperatorCheckbox"] = "toggleTopLevelBinType";
        },

        template: _.template(subFilterTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "change .newType": "handleTextFieldsChange",
            "change .newProperty": "handlePropertyChange",
            "click .sub-filter-marker": "stopPropagation",
            "click input": "stopPropagation",
        },

        addOperatorToTopLevel: function(e, itemInfo) {
            this.stopPropagation(e);
            var oldBin =  _.findWhere(this.model.getBins(), {id: parseInt(itemInfo.sender.prop("id").split("-")[0])});
            var bin = this.model.get("topLevelBin");
            var operator = _.findWhere(oldBin.operators, {id: parseInt(itemInfo.itemId.split("-")[0])}),
                newOperatorList = _.reject(oldBin.operators, function(operator) {
                    return operator.id == parseInt(itemInfo.itemId.split("-")[0]);
                });
            
            console.log("SENDER: ", itemInfo.sender);
            oldBin.operators = newOperatorList;
            bin.operators.push(operator);

            this.reRender();
        },

        addOperatorToInnerBin: function(e, itemInfo) {
            this.stopPropagation(e);
            var oldBin = itemInfo.sender.prop("id") === (this.subFilterLevel + "-topLevelBin") ? this.model.get("topLevelBin") : _.findWhere(this.model.getBins(), {id: parseInt(itemInfo.sender.prop("id").split("-")[0])});
            var bin =  _.findWhere(this.model.getBins(), {id: parseInt($(e.target).prop("id").split("-")[0])});
            var operator = _.findWhere(oldBin.operators, {id: parseInt(itemInfo.itemId.split("-")[0])}),
                newOperatorList = _.reject(oldBin.operators, function(operator) {
                    return operator.id == parseInt(itemInfo.itemId.split("-")[0]);
                });
            
            oldBin.operators = newOperatorList;
            bin.operators.push(operator);

            this.reRender();
        },

        preventDefault: function(e) {
            e.preventDefault();
            this.stopPropagation(e);
        },

        stopPropagation: function(e) {
            e.stopPropagation();
        },

        addBin: function() {
            var id = this.model.addBin();

            this.events["add #" + id + "-" + this.subFilterLevel + "-innerBin"] = "addOperatorToInnerBin";
            this.events["click #" + id + "-" + this.subFilterLevel + "-logicalOperatorCheckbox"] = "toggleInnerBinType";
            this.events["click #" + id + "-" + this.subFilterLevel + "-removeBin"] = "removeBin";
            this.delegateEvents();
            this.reRender();
        },

        removeBin: function(e) {
            var binId = $(e.target).prop("id").split("-")[0];

            this.model.removeBin(binId);
            delete this.events["add #" + binId + "-" + this.subFilterLevel + "-innerBin"];
            delete this.events["click #" + binId + "-" + this.subFilterLevel + "-logicalOperatorCheckbox"];
            delete this.events["click #" + binId + "-" + this.subFilterLevel + "-removeBin"];

            this.reRender();
        },

        toggleTopLevelBinType: function(e) {
            this.model.get("topLevelBin").type = $(e.target).prop("checked") ? "&&" : "||";
        },

        toggleInnerBinType: function(e) {
            var binId = $(e.target).prop("id").split("-")[0],
                bin = _.findWhere(this.model.getBins(), {id: parseInt(binId)});

            bin.type = $(e.target).prop("checked") ? "&&" : "||";
        },

        hideView: function() {
            this.$el.parent().css("left", 0);
        },
        
        showView: function() {
            this.$el.parent().css("left", "100%");
        },

        showSubFilterUIWithSeed: function(e) {
            var order = $(e.target).prop("id").split("-")[0],
                filter = _.findWhere(this.model.get("operators"), {order: parseInt(order)});

            if (!filter)
                filter = _.findWhere(this.model.get("operators"), {order: parseInt(order)});

            filter.isNew = false;
            this.showSubFilterUI(e, filter, $("#" + order + "-subFilterContainer-" + this.subFilterLevel));
        },

        showSubFilterUI: function(e, model, container) {
            e.stopPropagation();
            if (!container) 
                container = $("#newSubFilterContainer-" + this.subFilterLevel);

            $(e.target).closest(".subFilter").toggleClass("sub-filter-marker-active")
                .toggleClass("subFilter");
            $(".canFade.subFilterLevel-" + this.subFilterLevel).toggleClass("faded");
            var subFilter = new SubFilter({
                features: this.features,
                types: this.types,
                $el: container,
                subFilterLevel: this.subFilterLevel + 1,
                filters: this.filters,
                parentView: this,
                model: model
            });

            subFilter.render();
            this.addSubView(subFilter);

            if (this.subFilterLevel >= 1)
                this.parentView.hideView();
        },

        cacheOperators: function() {
            _.each(this.model.getBins(), function(bin) {
                _.each(bin.operators, function(operator) {
                    operator.property = $("#" + operator.id + "-" + bin.id + "-property").val();
                    operator.type = $("#" + operator.id + "-" + bin.id + "-type").val();
                    if (operator.upperBoundary) {
                        operator.lowerBoundary = $("#" + operator.id + "-" + bin.id + "-lower").val();
                        operator.upperBoundary = $("#" + operator.id + "-" + bin.id + "-upper").val();
                    }
                    else
                        operator.value = $("#" + operator.id + "-" + bin.id + "-lower").val();
                });
            });

            _.each(this.model.get("topLevelBin").operators, function(operator) {
                operator.property = $("#" + operator.id + "-property").val();
                operator.type = $("#" + operator.id + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.id + "-lower").val();
                    operator.upperBoundary = $("#" + operator.id + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.id + "-lower").val();
            });

            this.model.set("name", $("#filterName").val());
        },

        clearFilter: function() {
            this.model.set("name", "");
            this.model.clearOperators();
        },

        deleteSubFilter: function(subFilterView) {
            var operators = this.model.getOperators();

            operators.splice(subFilterView.order, 1);
            this.model.setOperators(operators);

            this.removeSubView(subFilterView.cid);
            this.reRender();
            this.parentView.showView();
        },

        deleteFilter: function() {
            this.parentView.deleteSubFilter(this);
            this.close();
        },

        cancelFilter: function() {
            this.parentView.removeSubView(this.cid);
            this.close();
            this.parentView.reRender();
            if (this.parentView.parentView)
                this.parentView.parentView.showView();
        },

        appendSubFilter: function(subFilter) {
            subFilter.set("isSubFilter", true);
            this.model.addOperator(subFilter, true);

            this.delegateEvents();
        },

        doneFilter: function(subFilter) {
            this.cacheOperators();
            this.close();
            this.parentView.reRender();
            if (this.parentView.parentView)
                this.parentView.parentView.showView();
        },

        createFilter: function(e) {
            this.model.isNew = false;
            this.parentView.appendSubFilter(this.model);
            this.close();
            if (this.parentView.parentView)
                this.parentView.parentView.showView();
        },

        updateFilter: function(e) {
            this.cacheOperators();
            this.parentView.updateSubFilter(this.model);
            this.close();
            if (this.parentView.parentView)
                this.parentView.parentView.showView();
        },

        handlePropertyChange: function(e) {
            this.updateAssociatedTypes($(e.target));
        },

        updateAssociatedTypes: function(target) {
            var selectedVal = target.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selectedProperty = $(target.parent().next().children()[0]),
                selectedValue = selectedProperty.val(),
                textPrefix = selectedProperty.prop("id").substring(0, selectedProperty.prop("id").toLowerCase().indexOf("type")),
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == (this.subFilterLevel + "-new") ? "Upper" : "upper"));
                 
            this.types = types;
            selectedProperty.html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo(selectedProperty);
            });

            selectedProperty.val(selectedValue);
            this.updateValueTextFields(selectedProperty, textFieldToUpdate);
        },

        handleTextFieldsChange: function(e) {
            var textPrefix = $(e.target).prop("id").substring(0, $(e.target).prop("id").toLowerCase().indexOf("type")),
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == (this.subFilterLevel + "-new") ? "Upper" : "upper"));

            this.updateValueTextFields($(e.target), textFieldToUpdate);
        },

        updateValueTextFields: function(target, fieldToToggle) {
            if (target.val() == "..") {
                fieldToToggle.parent().removeClass("hide");
                fieldToToggle.parent().prev().addClass("wide-45i");
            }
            else {
                fieldToToggle.parent().addClass("hide")
                    .prev().removeClass("wide-45i");
                fieldToToggle.val("");
            }
        },

        deleteRow: function(e) {
            e.stopPropagation();
            this.model.removeOperator($(e.target).prop("id").split("-")[0]);
            this.reRender();
        },

        addRow: function(e) {
            e.stopPropagation();
            var newOperator = {
                property: $("#newProperty-" + this.subFilterLevel).val(),
                type: $("#newType-" + this.subFilterLevel).val(),
                lowerBoundary: $("#newLower-" + this.subFilterLevel).val(),
                upperBoundary: $("#newUpper-" + this.subFilterLevel).val()
            };

            if ($("#newUpper-" + this.subFilterLevel).val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.set("name", $("#filterName-" + this.subFilterLevel).val());
            console.log("Subfilter " + this.subFilterLevel + ": ", newOperator);

            this.cacheOperators();
            this.model.addOperator(newOperator);
            this.reRender();
        },

        render: function () {
            var templateData = {
                types: this.types,
                features: this.features,
                model: this.model,
                subFilterLevel: this.subFilterLevel,
                filters: this.filters
            };

            this.$el.removeClass("pull-right");
            this.$el.html(this.template(templateData)).addClass("wide-95");
            this.updateAssociatedTypes($("#" + this.subFilterLevel + "-newProperty"));
            this.updateValueTextFields($("#" + this.subFilterLevel + "-newType"), $("#" + this.subFilterLevel + "-newUpper"));
            
            return this;
        }
    });

    return SubFilter;
});

