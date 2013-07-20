define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Layer',
  './SavedLayerView',
  './SavedBaseLayerView',
  'text!templates/partials/layers/LayersView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Layer, SavedLayerView, SavedBaseLayerView, layersTemplate){
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

                setupSavedLayers(userLayers);
            });

        },

        preRender: function(containingDiv, callback) {
            var view = this;
            this.$el.appendTo(containingDiv);
            OpenLayersUtil.getLayers(null, function(err, eeLayers) {
                view.layers.fetch({
                    url: "/api/layers/getAllForUser",
                    success: function(userLayers, res, opt) {
                        var baseLayers = userLayers.filter(function(layer) {
                            return layer.get("isBaseLayer") == true;
                        });
                        var nonBaseLayers = userLayers.filter(function(layer) {
                            return layer.get("isBaseLayer") == false;
                        });

                        view.setupFeatureTypes(userLayers, function(userLayers) {
                            view.$el.html(view.template());
                            for (var i = 0, len = nonBaseLayers.length; i < len; i++) {
                                view.$("#layersList").append("<li id='" + nonBaseLayers[i].get("_id") + "-listItem'></li>");
                                var savedLayerView = new SavedLayerView({
                                    model: nonBaseLayers[i],
                                    numberTypes: private.numberTypes,
                                    stringTypes: private.stringTypes,
                                    spatialTypes: private.spatialTypes
                                });
                                //Set the el like so that if I close the view (delete the layer), I automagically remove the list item
                                savedLayerView.$el = $("#" + nonBaseLayers[i].get("_id") + "-listItem");

                                $("#layersList").append(savedLayerView.render().$el);
                                view.addSubView(savedLayerView);
                            }

                            for (var i = 0, len = baseLayers.length; i < len; i++) {
                                var savedBaseLayerView = new SavedBaseLayerView({
                                    model: baseLayers[i],
                                });

                                $("#baseLayersList").append(savedBaseLayerView.render().$el);
                                view.addSubView(savedBaseLayerView);
                            }
                                
                            view.eeLayers = eeLayers;
                            view.fadeInViewElements();
                            callback();
                        });
                    }
                });
            });
        },

        render: function () {
            var view = this;

            this.$(".collapsed-header").each(function(index, header) {
                $(header).next().hide();
            });

            $("#layersList").sortable({
                placeholder: "ui-state-highlight",
                items: "li:not(.ui-state-disabled)",
                cancel: ".ui-state-disabled",
                handle: "span",
                stop: function(event, ui) {
                    //view.handleLayerReorder();
                }
            });

            return this;
        }
    });

    return LayersView;
});





