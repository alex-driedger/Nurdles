define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Utils, Filter, editFiltersTemplate){
    var private = {
        activeFilters: []
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.bindTo(Backbone.globalEvents, "addedFilter", this.render, this);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .collapsed": "handleExpand",
            "click .checkbox": "handleFilterToggle"
        },

        preRender: function() {
            this.$el.html(this.template());

            return this;
        },

        handleExpand: function(e) {
            $(e.target).closest("div .collapsed").next().slideToggle(200);
        },

        handleFilterToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target);

            if (target.prop("checked")) {
                target.closest(".collapsed").addClass("selected");
                var operators = this.getOperators(target.prop("id"));

                var filter = new Filter();

                filter._id = target.prop("id");
                filter.setOperators(operators);

                private.activeFilters.push(filter);
            }
            else {
                var id = target.prop("id");
                target.closest(".collapsed").removeClass("selected");

                private.activeFilters = _.reject(private.activeFilters, function(filter) {
                    return filter._id == id;
                });
            }

            Backbone.globalEvents.trigger("filtersChanged", private.activeFilters);
        },

        getOperators: function(filterId) {
            var operands = [],
                numberOfFilters = $("#" + filterId + "-table tr").length - 1; //We have a header row :-)

            console.log("About to apply " + numberOfFilters + " filters!");

            for (var i = 0; i < numberOfFilters; i++) {
                var operand = {};
                operand.property = $("#" + i + "-" + filterId + "-property").val();
                operand.type = $("#" + i + "-" + filterId + "-type").val();
                if (operand.upperBoundary) {
                    operand.lowerBoundary = $("#" + i + "-" + filterId + "-lower").val();
                    operand.upperBoundary = $("#" + i + "-" + filterId + "-upper").val();
                }
                else
                    operand.value = $("#" + i + "-" + filterId + "-lower").val();

                operands.push(operand)
            }

            return operands;
        },

        updateAssociatedTypes: function(property, typeDropDown) {
            var selectedVal = property.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selectedProperty = typeDropDown.val();
                 
            this.types = types;
            typeDropDown.html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo(typeDropDown);
            });

            typeDropDown.val(selectedProperty);
            //this.updateValueTextFields($("#newType"), $("#newUpper"));
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

        render: function () {

            var view = this;
            $.ajax({
                url: "/api/filters/getAllForUser",
                type: "GET",
                success: function(filters) {
                    var templateData = {
                        types: view.types,
                        features: view.features,
                        filters: filters,
                    };

                    view.$el.html(view.template(templateData));

                    _.each(filters, function(filter) {
                        var counter = 0;
                        _.each(filter.operators, function(operator) {
                            view.updateAssociatedTypes($("#" + counter + "-" + filter._id + "-property"), $("#" + counter + "-" + filter._id + "-type"));
                            view.updateValueTextFields($("#" + counter + "-" + filter._id + "-type"), $("#" + counter + "-" + filter._id + "-upper"));
                            counter++;
                        });
                    });

                    $('.filters-wrapper').find('.collapsed').next().hide();
                },
                error: function(err) {
                    console.log("ERROR: ", err);
                }
            });

            return this;
        }
    });

    return FiltersView;
});


