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

            if (!this.model)
                this.model = new Filter();

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

            var transformedOperators = [],
                operators = this.model.getOperators();

            for (var i = 0, len = operators.length; i < len; i++) {
                var operator = operators[i],
                    filter = new Filter();

                if (operator.operators) {
                    for (var j = 0, oLen = operator.operators.length; j < oLen; j++) {
                        if (operator.operators[j].isSubFilter) {
                            for (var key in operator.operators[j]) {
                                filter.set(key, operator.operators[j][key]);
                            }
                            filter.isSubFilter = true;
                            filter.subFilterId = filter.get("subFilterId");
                            filter.id = filter.get("id");
                            operator.operators[j] = filter;
                        }
                    }
                }
                transformedOperators.push(operator);
            };

            this.model.setOperators(transformedOperators);
        },

        template: _.template(subFilterTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "change .newType": "handleTextFieldsChange",
            "change .newProperty": "handlePropertyChange",
            "click .sub-filter-marker": "stopPropagation",
            "click input": "stopPropagation"
        },

        stopPropagation: function(e) {
            e.stopPropagation();
        },

        applyFilter: function(e) {
            Backbone.globalEvents.trigger("filtersChanged", [this.model]);
            console.log(this.model);
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
            var view = this;
            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.order + "-property-" + view.subFilterLevel).val();
                operator.type = $("#" + operator.order + "-type-" + view.subFilterLevel).val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.order + "-lower-" + view.subFilterLevel).val();
                    operator.upperBoundary = $("#" + operator.order + "-upper-" + view.subFilterLevel).val();
                }
                else
                    operator.value = $("#" + operator.order + "-lower-" + view.subFilterLevel).val();
            });

            this.model.set("name", $("#filterName-" + this.subFilterLevel).val());
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
                selecteProperty = $("#newType-" + this.subFilterLevel).val(),
                view = this;
                 
            this.types = types;
            $("#newType-" + this.subFilterLevel).html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo($("#newType-" + view.subFilterLevel));
            });

            $("#newType-" + this.subFilterLevel).val(selecteProperty);
            this.updateValueTextFields($("#newType-" + this.subFilterLevel), $("#newUpper-" + this.subFilterLevel));
        },

        handleTextFieldsChange: function(e) {
            this.updateValueTextFields($(e.target), $("#newUpper-" + this.subFilterLevel));
        },

        updateValueTextFields: function(target, fieldToToggle) {
            $("#editFilter .staged").toggleClass("wide-95");
            if (target.val() == "..") {
                target.closest("td").next().prop("colspan", "1")
                fieldToToggle.removeClass("hide");
                fieldToToggle.parent().removeClass("hide");
            }
            else {
                fieldToToggle.addClass("hide");
                fieldToToggle.parent().addClass("hide");
                fieldToToggle.html("");
                target.closest("td").next().prop("colspan", "2")
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
            this.updateAssociatedTypes($("#newProperty-" + this.subFilterLevel));
            this.updateValueTextFields($("#newType-" + this.subFilterLevel), $("#newUpper"));
            
            return this;
        }
    });

    return SubFilter;
});

