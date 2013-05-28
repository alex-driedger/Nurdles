define([
       'baseview',
       'basecollection',
       'openlayersutil',
       '../../models/Layer',
       './FeaturePopup',
       './MeasurePopup',
       '../partials/map/TopToolsRow',
       'text!templates/map/MapView.html',
       '../../components/DynamicMeasure'
], function(BaseView, BaseCollection, OpenLayersUtil, Layer, FeaturePopup, MeasurePopup, TopToolsRow, mapTemplate){
    var private = {
        /*-----
        * These are methods taken from the demo site.
        * TODO: Either replace the functions with something nicer or use actual MATH values rather than hard coded numbers
        * ---*/
        Lon2Merc: function(lon) {
            return 20037508.34 * lon / 180;
        },

        Lat2Merc: function(lat) {
            var PI = 3.14159265358979323846;
            lat = Math.log(Math.tan((90 + lat) * PI / 360)) / (PI / 180);
            return 20037508.34 * lat / 180;
        },

        showInfo: function(evt, view) {
            if (evt.features && evt.features.length > 0)
                private.onFeatureSelect(evt, view.model, view);
        },

        applyTrack: function(evt, view) {
            var shipInfo,
                latLongOfClick = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y)),
                filter = {},
                exactAISLayer = map.getLayersByName("exactAIS:HT30")[0];

            if (evt.features && evt.features.length > 0) {
                shipInfo = evt.features[0];
                filter.operators = [];
                filter.operators.push({
                    property: "mmsi",
                    value: shipInfo.data.mmsi,
                    type: "=="
                });

                exactAISLayer.params["FILTER"] = OpenLayersUtil.convertFilterToFilterParam([filter]);
                exactAISLayer.redraw();
            }
        },

        // Needed only for interaction, not for the display.
        onPopupClose: function(evt) {
            // 'this' is the popup.
            var feature = this.feature;
            if (feature.layer) { // The feature is not destroyed
                selectControl.unselect(feature);
            } else { // After "moveend" or "refresh" events on POIs layer all
                //     features have been destroyed by the Strategy.BBOX
                this.destroy();
            }
        },

        onFeatureSelect: function(evt, map, view) {
            var featureInfo = evt.features[0],
                bounds = null,
                projection = OpenLayersUtil.getProjection();

            //We need to transform the points to properly place the popup
            featureInfo.geometry.transform(projection.displayProjection, projection.projection)

            //If we're dealing with a point feature, we won't have getBounds so 
            //We'll need to create our bounds before grabbing the center LonLat
            if (featureInfo.geometry.getBounds())
                bounds = featureInfo.geometry.getBounds();
            else
                bounds = featureInfo.geometry.createBounds();

            console.log(bounds.getCenterLonLat());

            var featurePopup = new FeaturePopup({
                shipInformation:  {
                    data: featureInfo
                },
                map: map,
                position: bounds.getCenterLonLat()
            }, view);

            view.addSubView(featurePopup);
            featurePopup.render();
        }
    };

    var MapView = BaseView.extend({

        initialize: function(args) {
            this.model = new OpenLayers.Map({
                controls: [
                    new OpenLayers.Control.Zoom({ name: "Zoom", 'position': new OpenLayers.Pixel(50, 50) }),
                    new OpenLayers.Control.Navigation({name: "Navigation"})
                ],
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
                numZoomLevels: 18,
                maxResolution: 156543,
                units: 'm'
            });
            this.userLayers = new BaseCollection([], {model: Layer});
            this.initialFiltersToLoad = [];
            this.isHeaderViewable = true;

            /*
            * App-wide events to listen to 
            */
            this.bindTo(Backbone.globalEvents, "filtersChanged", this.updateFilters, this);
            this.bindTo(Backbone.globalEvents, "initialFilterLoad", this.queueInitialFilters, this);
            this.bindTo(Backbone.globalEvents, "layersChanged", this.updateLayers, this);
            this.bindTo(Backbone.globalEvents, "layerStylesReordered", this.updateLayerStyles, this);
            this.bindTo(Backbone.globalEvents, "layersReordered", this.updateLayerOrder, this);
            this.bindTo(Backbone.globalEvents, "toggleGraticule", this.toggleGraticule, this);
            this.bindTo(Backbone.globalEvents, "toggleMeasure", this.toggleMeasure, this);

            this.addControlsToMap();
            this.getExactEarthLayers(this.getUserLayers);
        },

        events: {
            "click #collapseHeader": function(e) {
                if (this.isHeaderViewable) {
                    $("#main-content").css("top", 0);
                    $("#collapseHeaderIcon").attr("src", "../../img/arrow-down.png");
                    this.isHeaderViewable = false;
                }
                else {
                    $("#main-content").css("top", "55px");
                    $("#collapseHeaderIcon").attr("src", "../../img/arrow-up.png");
                    this.isHeaderViewable = true;
                }
            }
        },


        updateLayers: function(layers) {
            var map = this.model;

            _.each(layers.models, function(layer) {
                map.getLayersByName(layer.get("name"))[0].setVisibility(layer.get("active"));
            });

            console.log(layers.models);
        },

        updateLayerOrder: function(layerIds) {
            var map = this.model;

            for (var i = 1, len = map.layers.length; i < len; i++) {
                var layer = map.layers[i];
                if (layerIds.indexOf(layer.name) == -1)
                    map.setLayerIndex(layer, -1);
                else
                    map.setLayerIndex(layer, i + 1); //To bump it above the base layer
            }
        },

        updateLayerStyles: function(layer) {
            var eeLayer = map.getLayersByName(layer.get("name"))[0],
                params = layer.get("exactEarthParams");

            eeLayer.mergeNewParams(params);
        },

        queueInitialFilters: function(filters) {
            this.initialFiltersToLoad = filters;
            this.loadInitialFilters();
        },

        //This function exists because need a common landing point when loading
        //filters and the map at the same time. We call this when were done loading
        //filters from the db AND when we're done loading the layers on the map.
        //Only once both are done can we apply the filters to the map.
        loadInitialFilters: function() {
            if (this.layersLoaded && this.initialFiltersToLoad.length > 0) {
                this.updateFilters(this.initialFiltersToLoad);
                delete this.initialFiltersToLoad;
            }
        },

        updateFilters: function(filters) {
            var map = this.model;

            var exactAISLayer = map.getLayersByName("exactAIS:LVI")[0];

            if (filters.length > 0) {
                exactAISLayer.mergeNewParams({"FILTER": this.createOpenLayersFilters(filters)});
            }
        },

        createOpenLayersFilters: function(filters) {
            var simplifiedFilters = [];

            for (var i = 0, len = filters.length; i< len; i++) {
                simplifiedFilters.push({operators: filters[i].get("operators")})
            };

            return OpenLayersUtil.convertFilterToFilterParam(simplifiedFilters);
        },

        toggleGraticule: function(activate) {
            _.each(this.model.controls, function(control) {
                if (control.name === "Graticule") {
                    if (activate)
                        control.activate();
                    else
                        control.deactivate();
                    return
                }
            });
        },

        toggleMeasure: function(activate) {
            _.each(this.model.controls, function(control) {
                if (activate) {
                    switch (control.name) {
                        case "Measure":
                            var measurePopupView = new MeasurePopup({
                                measureControl: control
                            });

                            control.activate();
                            measurePopupView.render();
                            break;
                         case "GetFeatureInfo":
                             control.deactivate();
                            break;
                    }
                }
                else {
                    switch (control.name) {
                        case "Measure":
                            control.deactivate();
                            Backbone.globalEvents.trigger("measureEnd");
                            break;
                         case "GetFeatureInfo":
                             control.activate();
                            break;
                    }
                }
            });

        },

        getExactEarthLayers: function(callback) {
            var view = this;

            OpenLayersUtil.getLayers(null, function(err, layers) {
                if (err)
                    console.log("ERROR GETTING LAYERS: ", err);
                else
                    callback(layers, view);
            });
        },

        addActiveLayersToMap: function(eeLayers, userLayers, view) {
            console.log(eeLayers);
            var layersToAddToMap = [];
                haveActiveBaseLayer = false; //Used to keep track if we've added a baselayer yet.

            _.each(eeLayers, function(eeLayer) {
                var layer,
                    userLayer = userLayers.findWhere({name: eeLayer.Name}),
                    params = {};

                    if (userLayer)
                        params = userLayer.get("exactEarthParams");

                    layer = new OpenLayers.Layer.WMS(
                        eeLayer.Name, "https://owsdemo.exactearth.com/wms?authKey=tokencoin",
                        params,
                        {
                            singleTile: false,
                            ratio: 1,
                            yx: { 'EPSG:4326': true },
                            wrapDateLine: true
                        }
                    );

                    view.model.addLayer(layer);

                    if (userLayer.get("isBaseLayer") && userLayer.get("active")) {
                        view.model.setBaseLayer(layer);
                        haveActiveBaseLayer = true;
                    }
                    else {
                        view.model.setLayerIndex(layer, userLayer.get("order"));
                        layer.setVisibility(userLayer && userLayer.get("active"));
                    }
            });

            if (!haveActiveBaseLayer) {
                var basicMapLayer = new OpenLayers.Layer.OSM("OSMBaseMap", null,
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize"
                    });
                view.model.addLayer(basicMapLayer);

                var basicMapLayer = new OpenLayers.Layer.WMS("WMSBaseMap", "http://labs.metacarta.com/wms/vmap0?", 
                    {layers: "basic"}, 
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize"
                    });
            }

            eeLayers = userLayers.filter(function(layer) {
                return layer.get("isExactEarth");
            });
            customLayers = userLayers.reject(function(layer) {
                return (layer.get("isExactEarth") || layer.get("isBaseLayer"));
            });
            baseLayers = userLayers.filter(function(layer) {
                return layer.get("isBaseLayer");
            });

            this.eeLayers = new BaseCollection(eeLayers, {model: Layer});
            this.customLayers = new BaseCollection(customLayers, {model: Layer});
            this.baseLayers = new BaseCollection(baseLayers, {model: Layer});

            this.layersLoaded = true;
            this.loadInitialFilters();

        },

        getUserLayers: function(eeLayers, view) {
            view.userLayers.fetch({
                url: "/api/layers/getAllForUser",
                success: function(userLayers, res, opt) {
                    view.addActiveLayersToMap(eeLayers, userLayers, view);
                    view.mapLoaded(view);
                }
            });
        },

        addControlsToMap: function() {
            var view = this,
            oInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
                name: "GetFeatureInfo",
                url: 'https://owsdemo.exactearth.com/wms?authKey=tokencoin',
                    title: 'Identify features by clicking',
                infoFormat: "application/vnd.ogc.gml",
                queryVisible: true,
                eventListeners: {
                    getfeatureinfo: function(evt) {
                        private.showInfo(evt, view);
                        private.applyTrack(evt, view);
                    }
                }
            });

            this.model.addControl(oInfoControl);
            oInfoControl.activate();

            /**************************
            * Measure Controls 
            **************************/
            var measureControl = new OpenLayers.Control.DynamicMeasure(
                OpenLayers.Handler.Path,
                {
                    name: "Measure",
                    persist: true
                }
            );

            this.model.addControl(measureControl);

            var graticuleControl = new OpenLayers.Control.Graticule({
                name: "Graticule",
                numPoints: 2,
                labelled: true,
                autoActivate: false
            });

            this.model.addControl(graticuleControl);
        },

        mapLoaded: function(view) {
            view.render();

            Backbone.globalEvents.trigger("eeLayersFetched", view.eeLayers);
            Backbone.globalEvents.trigger("customLayersFetched", view.customLayers);
            Backbone.globalEvents.trigger("baseLayersFetched", view.baseLayers);

            //Optional event 
            Backbone.globalEvents.trigger("mapLoaded", view.model);
        },

        render: function () {
            this.$el.html(mapTemplate);

            var controlsView = new TopToolsRow(),
                graticuleControl,
                map = this.model;

            controlsView.render();
            this.addSubView(controlsView);

            OpenLayers.ProxyHost = "proxy?url=";

            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            map.render("map");
            OpenLayers.Util.onImageLoadError = function () { }

            map.events.register("mousemove", map, function(e) { 
                var latlon = map.getLonLatFromViewPortPx(e.xy) ;
                latlon.transform( map.projection, map.displayProjection);
                OpenLayers.Util.getElement("coordinates").innerHTML = latlon.lat + ", " + latlon.lon;
            });

            map.setCenter(new OpenLayers.LonLat(private.Lon2Merc(0), private.Lat2Merc(25)), 3);

            map.zoomToMaxExtent();

            window.map = map; //BAD BAD BAD BAD but easy to manipulate the map through the console.
        }
    });

    return MapView;
});
