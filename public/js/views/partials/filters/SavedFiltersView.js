define([
  'baseview',
  'openlayersutil',
  './FilterDetailsView',
  'text!templates/partials/filters/SavedFiltersView.html'
], function(Baseview, Utils, FilterDetailsView, editFiltersTemplate){
    var private = {
        isFilterActive: function(filter, view) {
            for (var i = 0, len = view.activeFilters.length; i < len; i++) {
                if (view.activeFilters[i].get("_id") === filter.get("_id"))
                    return i;
            }

            return -1;
        },

        updateActiveFilters: function(filter, view) {
            var triggerRedraw = false;
            return _.map(view.activeFilters, function(activeFilter) {
                if (activeFilter.get("_id") === filter.get("_id")) {
                    triggerRedraw = true;
                    return filter;
                }
                else
                    return activeFilter;
            });
        },
    };

    var SavedFiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.activeFilters = [];
            this.activeFiltersFromState = [];
            this.expandedFilters = [];

            this.bindTo(Backbone.globalEvents, "addedFilter", this.appendNewFilter, this);
            this.bindTo(Backbone.globalEvents, "deleteFilter", this.deleteFilter, this);
            this.bindTo(Backbone.globalEvents, "toggleExpandedFilter", this.toggleExpandedFilter, this);
            this.bindTo(Backbone.globalEvents, "activateFilter", this.activateFilter, this);
            this.bindTo(Backbone.globalEvents, "updateFilter", this.updateFilter, this);
        },

        template: _.template(editFiltersTemplate),

        preRender: function() {
            this.$el.html(this.template());

            return this;
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

        updateFilter: function(filter) {
            if (private.isFilterActive(filter, this) != -1)
                Backbone.globalEvents.trigger("filtersChanged", private.updateActiveFilters(filter, this));
        },

        appendNewFilter: function(filter) {
            //TODO: Add new filter at the beginning of the list
        },

        deleteFilter: function(filter) {
            var indexOfFilterToDelete = private.isFilterActive(filter, this);

            if (indexOfFilterToDelete !== -1) {
                this.activeFilters.splice(indexOfFilterToDelete, 1);
                Backbone.globalEvents.trigger("filtersChanged", this.activeFilters); 
            }
        },

        loadSavedFiltersView: function(filters, view) {
            //Remember, filters is a backbone collection 
            //Use Collection methods 
            view.$el.html(view.template());

            filters.forEach(function(filter) {
                var detailsView = new FilterDetailsView({
                    model: filter,
                    tempOperator: {}, //operator used to populate last row
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
                var view = this,
                    filtersWithActiveInfoInjected = [];

                this.filters.fetch({
                    url: "/api/filters/getAllForUser",
                    success: function(list, res, opt) {
                        view.activeFilters = list.where({active: true});

                        view.loadSavedFiltersView(view.filters, view);

                        if (view.activeFilters.length > 0) {
                            Backbone.globalEvents.trigger("filtersChanged", view.activeFilters);
                        }
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


