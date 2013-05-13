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

        saveState: function() {
            var view = this,
                activeFilterIds = _.map(this.activeFilters, function(activeFilter) {
                    return activeFilter.get("_id");
                });
          
            $.ajax({
                type: "POST",
                url: "api/filters/saveState",
                data: {
                    activeFilters: activeFilterIds
                }
            });
        },

        restoreState: function() {
            var view = this;
          
            $.ajax({
                type: "GET",
                url: "api/filters/getState",
                success: function(activeFiltersFromState) {
                    view.activeFiltersFromState = activeFiltersFromState;
                }
            });

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

        mapRequiresInitialFilters: function() {
            var view = this;

            if (this.activeFilters.length === 0 && this.activeFiltersFromState.length !== 0) {
                this.filters.forEach(function(filter) {
                    if (_.contains(view.activeFiltersFromState, filter.get("_id")))
                        view.activeFilters.push(filter);
                });

                Backbone.globalEvents.trigger("filtersChanged", this.activeFilters);
            }

        },

        render: function (isLocalRender) {
            if (typeof isLocalRender == "undefined" || isLocalRender == false) {
                console.log("Fetching from DB");
                var view = this,
                    filtersWithActiveInfoInjected = [];

                this.filters.fetch({
                    url: "/api/filters/getAllForUser",
                    success: function(list, res, opt) {
                        filtersWithActiveInfoInjected = _.map(list.models, function(filter) {
                            if (_.contains(view.activeFiltersFromState, filter.get("_id")) )
                                filter.active = true; //Don't set it because we don't want to alter the actual model.
                            return filter
                        });

                        view.loadSavedFiltersView(view.filters, view);

                        if (view.mapRequiresInitialFilters()) {
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


