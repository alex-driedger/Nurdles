define([
  'baseview',
  'openlayersutil',
  './FilterDetailsView',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Utils, FilterDetailsView, editFiltersTemplate){
    var private = {
    };

    var SavedFiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.activeFilters = [];
            this.expandedFilters = [];

            this.bindTo(Backbone.globalEvents, "addedFilter", this.appendNewFilter, this);
            this.bindTo(Backbone.globalEvents, "deleteFilter", this.deleteFilter, this);
            this.bindTo(Backbone.globalEvents, "toggleExpandedFilter", this.toggleExpandedFilter, this);
            this.bindTo(Backbone.globalEvents, "activateFilter", this.activateFilter, this);
        },

        template: _.template(editFiltersTemplate),

        events: {
        },

        preRender: function() {
            this.$el.html(this.template());

            return this;
        },

        toggleExpandedFilter: function(filter) {
            
        },

        activateFilter: function(data) {
            if (data.activate)
                this.activeFilters.push(data.filter);
            else {
                this.activeFilters = _.reject(this.activeFilters, function(filter) {
                    return filter.get("_id") == data.filter.get("_id");
                });
            }

            Backbone.globalEvents.trigger("filtersChanged", this.activeFilters);
        },

        appendNewFilter: function(filter) {
            //TODO: Add new filter at the beginning of the list
        },

        deleteFilter: function(filter) {
            //TODO: Delete Filter from DB
        },

        loadSavedFiltersView: function(filters, view) {
            //Remember, filters is a backbone collection 
            //Use Collection methods 
            view.$el.html(view.template());

            filters.forEach(function(filter) {
                var detailsView = new FilterDetailsView({
                    model: filter,
                    features: view.features,
                });

                view.addSubView(detailsView);
                view.$el.append(detailsView.preRender().$el);
                detailsView.render();
            });


        },

        render: function (isLocalRender) {
            if (typeof isLocalRender == "undefined" || isLocalRender == false) {
                console.log("Fetching from DB");
                var view = this;

                this.filters.fetch({
                    url: "/api/filters/getAllForUser",
                    success: function(filters, res, opt) {
                        console.log(filters.models[0].get("operators"), res, opt);

                        view.loadSavedFiltersView(view.filters, view);
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

    return SavedFiltersView;
});


