define([
  'baseview',
  'openlayersutil',
  './SavedFiltersView',
  './EditFiltersView',
  '../../../models/Filter',
  '../../../collections/FilterCollection',
  'text!templates/partials/filters/EditFiltersView.html',
  'text!templates/partials/filters/FiltersView.html'
], function(Baseview, OpenLayersUtil, SavedFiltersView, EditFiltersView, Filter, FilterCollection, editFiltersTemplate, showFiltersTemplate){
    var private = {
        features: []
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.filters = new Backbone.Collection.extend({
                model: Filter 
            });

        },

        template: _.template(showFiltersTemplate),

        events: {},

        preRender: function(callback) {
            var view = this;
            OpenLayersUtil.getFilterFeatures(function(err, response) {
                private.features = response;
                view.$el.html(view.template());
                callback();
            });
            return this;
        },

        render: function () {
            var editFilters = new EditFiltersView({
                $el: $("#editFilter"),
                features: private.features
                }),
                savedFilters = new SavedFiltersView({
                    $el: $("#savedFilters"),
                    features: private.features
                });

            this.addSubView(editFilters);
            this.addSubView(savedFilters);
            editFilters.render();
            savedFilters.render();

            return this;
        }
    });

    return FiltersView;
});

