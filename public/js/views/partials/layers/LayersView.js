define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Layer',
  './SavedLayerView',
  './SavedBaseLayerView',
  './NewLayerModalView',
  'text!templates/partials/layers/LayersView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Layer, SavedLayerView, SavedBaseLayerView, NewLayerModalView, layersTemplate){
    var private = {
        numberTypes: [],
        stringTypes: [],
        spatialTypes: []
    };

    var LayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.layers = new BaseCollection([], {model: Layer});
            this.nonBaseLayers = new BaseCollection([], {model: Layer});
            this.baseLayers = new BaseCollection([], {model: Layer});

            this.bindTo(Backbone.globalEvents, "layerAdded", this.addLayer);
            this.bindTo(Backbone.globalEvents, "layerRemoved", this.removeLayer);

        },

        template: _.template(layersTemplate),

        events: {
            "click #addLayer": "addNewLayer",
            "click #addBaseLayer": "addNewBaseLayer"
        },
        
        addNewLayer: function(e) {
            e.preventDefault();
            var layer = new Layer();
            layer.initAsLVILayer();

            var modal = new NewLayerModalView({
                layers: this.nonBaseLayers,
                eeLayers: this.eeLayers,
                isBaseLayer: false,
                model: layer,
                nextOrder: this.nonBaseLayers.length + 1 //to accomodate base layer
            });
            modal.attachToPopup($("#modalPopup"));
            modal.render();
            modal.updateStyleSelect(null, this.eeLayers[0].Name);

            modal.show();
        },

        addLayer: function(layerInfo) {
            var view = this;
            if (layerInfo.isBaseLayer) 
                this.baseLayers.add(layerInfo.layer);
            else
                this.nonBaseLayers.add(layerInfo.layer);

            this.$("#layersContainer").html("");
            this.reRender([$("#layersContainer"), function() {
                view.render();
            }]);
        },

        removeLayer: function() {
            var view = this;
            this.$("#layersContainer").html("");
            this.reRender([$("#layersContainer"), function() {
                view.render();
            }]);
        },

        addNewBaseLayer: function(e) {
            e.preventDefault();
            var layer = new Layer();
            layer.initAsBaseLayer();

            var modal = new NewLayerModalView({
                layers: this.nonBaseLayers,
                eeLayers: this.eeLayers,
                isBaseLayer: true,
                model: layer
            });
            modal.attachToPopup($("#modalPopup"));
            modal.render();
            modal.updateStyleSelect(null, this.eeLayers[0].Name);

            modal.show();
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

        handleLayerReorder: function(layerIds) {
            var view = this;
            var orderCounter = 1;
            _.each(layerIds, function(id) {
                var layer;
                id = id.split("-")[0];
                layer = view.nonBaseLayers.findWhere({_id: id });
                layer.set("order", orderCounter);
                layer.update();
                orderCounter++;
            });

            Backbone.globalEvents.trigger("layersReordered", layerIds);

            console.log(layerIds);
        },

        preRender: function(containingDiv, callback) {
            var view = this;
            this.$el.appendTo(containingDiv);
            OpenLayersUtil.getLayers(null, function(err, eeLayers) {
                view.layers.fetch({
                    url: "/api/layers/getAllForUser",
                    success: function(userLayers, res, opt) {
                        userLayers.each(function(layer) {
                            if (layer.get("isBaseLayer") == true) {
                                layer.collection = view.baseLayers;
                                view.baseLayers.add(layer);
                            }
                        });
                        userLayers.each(function(layer) {
                            if (layer.get("isBaseLayer") == false) {
                                layer.collection = view.nonBaseLayers;
                                view.nonBaseLayers.add(layer);
                            }
                        });
                        userLayers.reset();
                        view.setupFeatureTypes(userLayers, function(userLayers) {
                            view.$el.html(view.template());
                            view.nonBaseLayers.each(function(layer) {
                                view.$("#layersList").append("<li id='" + layer.get("_id") + "-" + layer.get("name") + "-listItem'></li>");
                                var savedLayerView = new SavedLayerView({
                                    model: layer,
                                    numberTypes: private.numberTypes,
                                    stringTypes: private.stringTypes,
                                    spatialTypes: private.spatialTypes
                                });
                                //Set the el like so that if I close the view (delete the layer), I automagically remove the list item
                                savedLayerView.$el = $("#" + layer.get("_id") + "-" + layer.get("name") + "-listItem");

                                $("#layersList").append(savedLayerView.render().$el);
                                view.addSubView(savedLayerView);
                            });

                            view.baseLayers.each(function(baseLayer) {
                                var savedBaseLayerView = new SavedBaseLayerView({
                                    model: baseLayer,
                                });

                                $("#baseLayersList").append(savedBaseLayerView.render().$el);
                                view.addSubView(savedBaseLayerView);
                            });
                                
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
                    view.handleLayerReorder($(this).sortable("toArray").filter(function(item) { 
                        return item != "";
                    }).reverse());
                }
            });

            this.delegateEvents();

            return this;
        }
    });

    return LayersView;
});





