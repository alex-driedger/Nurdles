define([
  'baseview',
  '../../../models/Filter',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Filter, editFiltersTemplate){
    var private = {
        activeFilters: []
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
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
            $(e.target).next().slideToggle(200);
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
                numberOfFilters = $("#" + filterId + "-table tr").length - 1, //We have a header row :-)
                operand = {};

            console.log("About to apply " + numberOfFilters + " filters!");

            for (var i = 0; i < numberOfFilters; i++) {
                operand.property = $("#" + i + "-" + filterId + "-property").val();
                operand.type = $("#" + i + "-" + filterId + "-type").val();
                operand.lowerBoundary = $("#" + i + "-" + filterId + "-lower").val();
                operand.upperBoundary = $("#" + i + "-" + filterId + "-upper").val();
                operands.push(operand)
            }

            return operands;
        },

        render: function () {

            var view = this;
            $.ajax({
                url: "/api/filters/getAllForUser",
                type: "GET",
                success: function(filters) {
                    console.log("FILTERS :", filters);
                    view.$el.html(view.template({filters: filters}));

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


