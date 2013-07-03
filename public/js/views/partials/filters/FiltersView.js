define([
  'baseview',
  'basecollection',
  'openlayersutil',
  './SavedFiltersView',
  './EditFiltersView',
  '../../../models/Filter',
  'text!templates/partials/filters/EditFiltersView.html',
  'text!templates/partials/filters/FiltersView.html'
], function(Baseview, BaseCollection, OpenLayersUtil, SavedFiltersView, EditFiltersView, Filter, editFiltersTemplate, showFiltersTemplate){
    var private = {
        features: [],

        transformDataIntoModel: function(modelData) {
            var topLevelOperators, bins, filter;

            filter = modelData;
            if (modelData.isSubFilter) {
                if (!modelData.get) {
                    filter = new Filter();
                    for (var key in modelData) {
                        filter.set(key, modelData[key]);
                    }
                }
            }

            topLevelOperators = filter.get("topLevelBin").operators;
            bins = filter.getBins();

            filter.clearOperators();

            for (var i = 0, len = topLevelOperators.length; i < len; i++) {
                if (topLevelOperators[i].isSubFilter) {
                    filter.addOperator(this.transformDataIntoModel(topLevelOperators[i]));
                }
                else
                    filter.addOperator(topLevelOperators[i]);
            }

            for (var i = 0, len = bins.length; i < len; i++) {
                filter.addBin();
                for (var j = 0, len2 = bins[i].operators.length; j < len2; j++) {
                    if (bins[i].operators[j].isSubFilter) {
                        filter.bins[j].operators.push(this.transformDataIntoModel(bins[i].operators[j]));
                    }
                    else
                        filter.bins[j].operators.push(bins[i].operatos[j]);
                }
            }

            return filter;
        }
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.isDynamicContainer = true;

            this.filters = new BaseCollection([], {model: Filter});

            this.filters.modelSpecificParse = function(models) {
                var transformedModels = [];
                for (var i = 0, len = models.length; i < len; i++) {
                    transformedModels.push(private.transformDataIntoModel(models[i]));
                }
                return transformedModels;
            };

        },

        template: _.template(showFiltersTemplate),

        events: {},

        preRender: function(containingDiv, callback) {
            var view = this;
            this.$el.appendTo(containingDiv)
            OpenLayersUtil.getFeatureFields(function(err, response) {
                private.features = response;
                view.fadeInViewElements(view.template());
                callback();
            });

            return this;
        },

        render: function () {
            var editFilters = new EditFiltersView({
                    $el: $("#editFilter"),
                    features: private.features,
                    filters: this.filters,
                }),
                savedFilters = new SavedFiltersView({
                    filters: this.filters,
                    $el: $("#savedFilters"),
                    features: private.features
                });

            this.addSubView(editFilters);
            this.addSubView(savedFilters);
            editFilters.render(true);
            savedFilters.render(false, true);

            return this;
        }
    });

    return FiltersView;
});

