define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Layer',
  './SavedLayerView',
  'text!templates/partials/layers/LayersView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Layer, SavedLayerView, layersTemplate){
    var private = {
        numberTypes: [],
        stringTypes: [],
        spatialTypes: []
    };

    var LayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.layers = new BaseCollection([], {model: Layer});

        },

        template: _.template(layersTemplate),

        events: {
        },

        setupFeatureTypes: function(userLayers, setupSavedLayers) {
            OpenLayersUtil.getFeatureFields(function(err, response) {
                private.features = response;
                private.numberTypes = _.filter(response, function(feature) {
                    return (
                        feature.type == "integer" ||
                        feature.type == "int" ||
                        feature.type == "double" ||
                        feature.type == "long" ||
                        feature.type == "decimal"
                    );
                });
                private.stringTypes = _.where(response, {type: "string"});

                for (var i = 0, len = response.length; i < len; i++) {
                    if ((!_.contains(private.numberTypes, response[i])) && (!_.contains(private.stringTypes, response[i])))
                        private.spatialTypes.push(response[i]);
                }
            });

            setupSavedLayers(userLayers);
        },

        preRender: function(containingDiv, callback) {
            var view = this;
            var htmlContent = "";

            this.$el.appendTo(containingDiv);
            OpenLayersUtil.getLayers(null, function(err, eeLayers) {
                view.layers.fetch({
                    url: "/api/layers/getAllForUser",
                    success: function(userLayers, res, opt) {
                        view.setupFeatureTypes(userLayers, function(userLayers) {
                            var htmlContent = "";
                            view.$el.html(view.template());
                            $.each(userLayers.models, function(index, layer) {
                                var savedLayerView = new SavedLayerView({
                                    model: layer,
                                    numberTypes: private.numberTypes,
                                    stringTypes: private.stringTypes,
                                    spatialTypes: private.spatialTypes
                                });

                                htmlContent += savedLayerView.render().$el.html();
                            });
                                
                            view.eeLayers = eeLayers;
                            view.$el.append(htmlContent);
                            view.fadeInViewElements(view.$el.html());
                            callback();
                        });
                    }
                });
            });
        },

        render: function () {
            var view = this;

            return this;
        }
    });

    return LayersView;
});





