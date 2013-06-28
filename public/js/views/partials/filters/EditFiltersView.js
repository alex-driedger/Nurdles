define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  './SubFilterView',
  'text!templates/partials/filters/EditFiltersView.html',
], function(Baseview, Utils, Filter, SubFilter, editFiltersTemplate){
    var EditFiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            if (!this.model)
                this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.bindTo(this.model, "removeOperator", this.cacheOperators);
            this.bindTo(this.model, "clearOperators", this.reRender);
            this.bindTo(this.model, "addOperator", this.render);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click #clearFilter": "clearFilter",
            "click #createFilter": "createFilter",
            "click #applyFilter": "applyFilter",
            "click .subFilter-1": "showSubFilterUI",
            "click .viewSubFilter-1": "showSubFilterUIWithSeed",
            "change .type": "handleTextFieldsChange",
            "change .property": "handlePropertyChange",
            "add #newTopLevelBin": "addOperatorToTopLevel",
            "click #newAddLogicBin": "addBin",
            "click #newLogicalOperatorCheckbox": "toggleTopLevelBinType"
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
            var oldBin = itemInfo.sender.prop("id") === "newTopLevelBin" ? this.model.get("topLevelBin") : _.findWhere(this.model.getBins(), {id: parseInt(itemInfo.sender.prop("id").split("-")[0])});
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

            this.events["add #" + id + "-innerBin"] = "addOperatorToInnerBin";
            this.events["click #" + id + "-logicalOperatorCheckbox"] = "toggleInnerBinType";
            this.events["click #" + id + "-removeBin"] = "removeBin";
            this.delegateEvents();
            this.reRender();
        },

        removeBin: function(e) {
            var binId = $(e.target).prop("id").split("-")[0];

            this.model.removeBin(binId);
            delete this.events["add #" + binId + "-innerBin"];
            delete this.events["click #" + binId + "-logicalOperatorCheckbox"];
            delete this.events["click #" + binId + "-removeBin"];

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

        applyFilter: function(e) {
            Backbone.globalEvents.trigger("filtersChanged", [this.model]);
            console.log(this.model);
        },

        hideView: function() {
            $("#sidebar").css("left", "-40%");
        },

        showView: function() {
            $("#sidebar").css("left", "0");
        },

        showSubFilterUIWithSeed: function(e) {
            var order = $(e.target).prop("id").split("-")[0],
                filter = _.findWhere(this.model.get("operators"), {order: parseInt(order)});

            this.showSubFilterUI(e, filter, $("#" + order + "-subFilterContainer-1"));
        },

        showSubFilterUI: function(e, model, container) {
            e.stopPropagation();
            if (!container) 
                container = $("#newSubFilterContainer");

            $(e.target).closest(".subFilter").toggleClass("sub-filter-marker-active")
                .toggleClass("subFilter");
            $(".canFade").toggleClass("faded");
            var subFilter = new SubFilter({
                features: this.features,
                types: this.types,
                $el: container,
                subFilterLevel: 1,
                filters: this.filters,
                parentView: this,
                model: model
            });

            subFilter.render();
            this.addSubView(subFilter);
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

        appendSubFilter: function(subFilter) {
            subFilter.set("isSubFilter", true);
            this.model.addOperator(subFilter, true);

            this.delegateEvents();
        },

        createFilter: function(e) {
            var view = this;
            this.model.set("name", $("#filterName").val());
            this.model.save(null, {
                success: function(response){
                    Backbone.globalEvents.trigger("addedFilter", response);
                    view.model = new Filter();
                    view.reRender();
                },
                error: function(err){
                    console.log(err); 
                },
                url: "/api/filters/save"
            });
            console.log(this.model);
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
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == "new" ? "Upper" : "upper"));
                 
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
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == "new" ? "Upper" : "upper"));

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

        deleteSubFilter: function(subFilterView) {
            this.removeSubView(subFilterView.cid);
            this.reRender();
        },

        deleteRow: function(e) {
            var ids = $(e.target).prop("id").split("-"),
                operatorId = ids[0],
                binId = ids[1];

            this.model.removeOperator(operatorId, binId, isNaN(parseInt(binId)));
            this.reRender();
        },

        addRow: function(e) {
            var newOperator = {
                property: $("#newProperty").val(),
                type: $("#newType").val(),
                lowerBoundary: $("#newLower").val(),
                upperBoundary: $("#newUpper").val()
            };

            if ($("#newUpper").val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.set("name", $("#filterName").val());
            console.log(newOperator);

            this.cacheOperators();
            this.model.addOperator(newOperator);
            this.reRender();
        },

        render: function () {
            var templateData = {
                types: this.types,
                features: this.features,
                model: this.model
            },
            view = this;

            this.$el.html(this.template(templateData));
            this.updateAssociatedTypes($("#newProperty"));
            this.updateValueTextFields($("#newType"), $("#newUpper"));


            $( "#newTopLevelBinContainer ul").sortable({
                placeholder: "ui-state-highlight",
                items: "li:not(.ui-state-disabled)",
                cancel: ".ui-state-disabled",
                connectWith: "#newTopLevelBinContainer ul",
                handle: "span",
                receive: function(event, ui) {
                    console.log($(this).prop("id") + " got a new operator");
                    $(event.target).trigger('add', {itemId: ui.item.prop("id"), sender: ui.sender});
                }
            }).disableSelection();

            return this;
        }
    });

    return EditFiltersView;
});
