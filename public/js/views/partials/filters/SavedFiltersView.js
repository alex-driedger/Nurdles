define([
  'baseview',
  'openlayersutil',
  './FilterDetailsView',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Utils, FilterDetailsView, editFiltersTemplate){
    var private = {
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.bindTo(Backbone.globalEvents, "addedFilter", this.appendNewFilter, this);
        },

        template: _.template(editFiltersTemplate),

        events: {
        },

        preRender: function() {
            this.$el.html(this.template());

            return this;
        },

        appendNewFilter: function(filter) {
            //TODO: Add new filter at the beginning of the list
        },

        loadSavedFiltersView: function(filters, view) {
            view.$el.html(view.template());

            _.each(filters, function(filter) {
                var detailsView = new FilterDetailsView({
                    filter: filter,
                    features: view.features,
                });

                view.addSubView(detailsView);
                view.$el.append(detailsView.render().$el);
            });


        },

        render: function (isLocalRender) {
            if (typeof isLocalRender == "undefined" || isLocalRender == false) {
                console.log("Fetching from DB");
                var view = this;
                $.ajax({
                    url: "/api/filters/getAllForUser",
                    type: "GET",
                    success: function(filters) {

                        view.filters = filters;
                        view.loadSavedFiltersView(view.filters, view);
                        //view.delegateEvents(view.events);
                    },
                    error: function(err) {
                        console.log("ERROR: ", err);
                    }
                });
            }
            else {
                console.log("Using cached");
                this.loadSavedFiltersView(this.filters, this);
                this.delegateEvents(this.events);
            }

            return this;
        }
    });

    return FiltersView;
});


