define([
  'baseview',
  '../../../models/Filter',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Filter, editFiltersTemplate){
    var private = {
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(editFiltersTemplate),

        events: {},

        preRender: function() {
            this.$el.html(this.template());
            return this;
        },

        render: function () {
            var view = this;
            $.ajax({
                url: "/api/filters/getAllForUser",
                type: "GET",
                success: function(filters) {
                    console.log("FILTERS :", filters);
                    view.$el.html(view.template({filters: filters}));
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


