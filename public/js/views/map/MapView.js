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
], function(BaseView, BaseCollection, Utils, Layer, FeaturePopup, MeasurePopup, TopToolsRow, mapTemplate){
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
    };

    var MapView = BaseView.extend({

        initialize: function(args) {
            var view = this;
            this.$el.html(mapTemplate);
            this.model = new OpenLayers.Map({
                controls: [
                    new OpenLayers.Control.Zoom({ name: "Zoom", 'position': new OpenLayers.Pixel(50, 50) }),
                    new OpenLayers.Control.Navigation({
                        name: "Navigation",
                        mouseWheelOptions: {
                            cummulative: true,
                            interval: 100
                        }
                    })
                ],
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
                numZoomLevels: 18,
                maxResolution: 156543,
                units: 'm'
            });
            this.layers = new BaseCollection([], {model: Layer});
            this.initialFiltersToLoad = [];
            this.filter = [];
            this.cachedSearchedShips = null;
            this.isHeaderViewable = true;

            /*
            * App-wide events to listen to 
            */
            this.bindTo(Backbone.globalEvents, "filtersChanged", this.updateFilters, this);
            this.bindTo(Backbone.globalEvents, "initialFilterLoad", this.queueInitialFilters, this);
            this.bindTo(Backbone.globalEvents, "layersChanged", this.updateLayers, this);
            this.bindTo(Backbone.globalEvents, "baseLayerSelected", this.changeBaseLayer, this);
            this.bindTo(Backbone.globalEvents, "layerStylesReordered", this.updateLayerStyles, this);
            this.bindTo(Backbone.globalEvents, "layersReordered", this.updateLayerOrder, this);
            this.bindTo(Backbone.globalEvents, "toggleGraticule", this.toggleGraticule, this);
            this.bindTo(Backbone.globalEvents, "toggleMeasure", this.toggleMeasure, this);
            this.bindTo(Backbone.globalEvents, "search", this.handleSearch, this);
            this.bindTo(Backbone.globalEvents, "locateShip", this.locateShip, this);
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

        locateShip: function(ship) {
            var map = this.model,
                size = new OpenLayers.Size(30,30),
                icon = new OpenLayers.Icon('../../img/target.png',size),
                markerLayer = map.getLayersByName("shipMarkers")[0],
                projection = Utils.getProjection();

            //We need to transform the points to properly place the popup
            
            if ( typeof markerLayer == "undefined" ) {
                markerLayer = new OpenLayers.Layer.Markers( "shipMarkers" );
                map.addLayer(markerLayer);
            }
            else {
                markerLayer.clearMarkers();
                markerLayer.redraw();
            }

            markerLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(ship.get("longitude"), ship.get("latitude")).transform(projection.displayProjection, projection.projection),icon));
        },

        handleSearch: function(searchTerm) {
            console.log(searchTerm);
            var filter;

            if (!isNaN(searchTerm)) {
                filter = new OpenLayers.Filter.Comparison({ 
                    type: OpenLayers.Filter.Comparison.EQUAL_TO, 
                    property: "mmsi", 
                    value: searchTerm
                });
            }
            else {
                filter = new OpenLayers.Filter.Comparison({ 
                    type: OpenLayers.Filter.Comparison.LIKE, 
                    matchCase:false, 
                    property: "vessel_name", 
                    value: searchTerm
                });
            }

            var filter_1_0 = new OpenLayers.Format.Filter({version: "1.1.0"}),
                xml = new OpenLayers.Format.XML(),
                filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: [filter]
                });

            filter = Utils.mergeActiveFilters(filter, map.getLayersByName("exactAIS:LVI")[0].params.FILTER);

            var  wfsProtocol = new OpenLayers.Protocol.WFS.v1_1_0({ 
                url: "/proxy/getWFSFeatures?url=https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=exactAIS:LVI&authKey=tokencoin", 
                featurePrefix: "", 
                featureType: "exactAIS:LVI", 
            }); 

            Backbone.globalEvents.trigger("showLoader");

            wfsProtocol.read ({ 
                filter: filter, 
                callback: this.processQuery, 
                scope: new OpenLayers.Strategy.Fixed 
            }); 
        },

        onFeatureSelect: function(evt, map, view) {
            var featureInfo = evt.features[0],
                bounds = null,
                projection = Utils.getProjection();

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
        },

        showInfo: function(evt, view) {
            if (evt.features && evt.features.length > 0)
                view.onFeatureSelect(evt, view.model, view);
        },

        applyTrack: function(evt, view) {
            var shipInfo,
                latLongOfClick = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y)),
                filter = new OpenLayers.Filter.Logical({type: "&&"}),
                exactAISLayer = map.getLayersByName("exactAIS:HT30")[0];

            if (evt.features && evt.features.length > 0) {
                shipInfo = evt.features[0];
                filter.filters.push({
                    property: "mmsi",
                    value: shipInfo.data.mmsi,
                    type: "=="
                });

                var filter_1_0 = new OpenLayers.Format.Filter({version: "1.1.0"});
                var xml = new OpenLayers.Format.XML(); 
                var filter_param = xml.write(filter_1_0.write(filter));

                exactAISLayer.params["FILTER"] = filter_param;
                exactAISLayer.redraw();
            }
        },

        changeBaseLayer: function(layer) {
            var map = this.model;

            map.setBaseLayer(map.getLayersByName(layer.get("name"))[0]);
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

            var layers = _.reject(map.layers, function(layer) {
                return layer.isBaseLayer || layer.markers || layer.getVisibility() == false;
            });
            var offset = map.layers.length - layers.length;

            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = map.getLayersByName(layerIds[i])[0];

                if (layerIds.indexOf(layer.name) == -1)
                    layer.setVisibility(false);
                else
                    map.setLayerIndex(layer, map.layers.length - i - 1);
            }

            _.each(map.layers, function(olLayer) {
                if (olLayer.markers)
                    map.setLayerIndex(olLayer, map.layers.length - 1)
            });
        },

        updateLayerStyles: function(layer) {
            var eeLayer = map.getLayersByName(layer.get("name"))[0],
                params = layer.get("exactEarthParams"),
                stylesLength = params.STYLES.split(",").length,
                filterParam;

            if (stylesLength > 1) {
                if (eeLayer.params.FILTER.indexOf("(") != -1) {
                    filterParam = eeLayer.params.FILTER.replace(/\(/gi, "");
                    filterParam = filterParam.substring(0, filterParam.length - 1);
                    filterParam = filterParam.split(")");
                    for (var i = 0, len = filterParam.length; i < len; i++) {
                        filterParam[i] = "(" + filterParam[i] + ")";
                    }
                    filterParam = filterParam.join();
                    filterParam = filterParam.replace(/,/g, "");
                }
                else {
                    filterParam = "(" + eeLayer.params.FILTER + ")";
                    for (var i = 1; i < stylesLength; i++) {
                        filterParam += filterParam ; //Needed if we have applied multiple styles on a filtered layer 
                    }
                }
            }
            //Reset filter to a single filter since we only have one style applied
            else  {
                filterParam = eeLayer.params.FILTER;
                if (filterParam && filterParam.indexOf("(") !== -1 ) //Only alter the filter param if we have one style but miltiple filters.
                    filterParam = filterParam.substring(1, filterParam.indexOf(")"));
            }

            params.FILTER = filterParam;
            layer.set("exactEarthParams", params);
            layer.update();

            eeLayer.mergeNewParams(params);
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

       setUpMap: function(renderWhenDone) {
           var defaultLayer = new OpenLayers.Layer.WMS("default", "https://owsdemo.exactearth.com/wms?authKey=tokencoin",
                {
                    transparent : "true",
                    format : "image/png",
                    STYLES : "VesselByType",
                    LAYERS : "exactAIS:LVI"
                },
                {
                    singleTile: false,
                    ratio: 1,
                    yx: { 'EPSG:4326': true },
                    wrapDateLine: true
                }),

                defaultBaseLayer = new OpenLayers.Layer.OSM("OSMBaseMap", null,
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize",
                        tileOptions: {crossOriginKeyword: null}
                    }),
                view = this;

           this.layers.fetch({
               url: "/api/layers/getAllForUser",
               success: function(fetchedLayers) {
                   if (fetchedLayers.models.length > 0) {
                       var baseLayers = fetchedLayers.models.filter(function(layer) {
                           return layer.isBaseLayer == true;
                       });
                       var userLayers = _.difference(fetchedLayers.models, baseLayers);

                       _.each(baseLayers, function(baseLayer) {
                           var olBaseLayer = Utils.convertLayerToOLLayer(baseLayer)
                           view.model.addLayer(olBaseLayer);
                           if (baseLayer.active)
                               view.model.setBaseLayer(olBaseLayer);
                       });
                       _.each(userLayers, function(layer) {
                           var olLayer = Utils.convertLayerToOLLayer(layer)
                           view.model.addLayer(olLayer);
                           view.model.setLayerIndex(olLayer, layer.get("order"));
                           olLayer.setVisibility(layer.get("active"));
                       });
                   }
                   else {
                       var horizonBaseLayer = new Layer();
                       var horizonLayer = new Layer();

                       horizonBaseLayer.set("isBaseLayer", true);
                       horizonBaseLayer.set("mapType", "OSM");
                       horizonBaseLayer.set("active", true);
                       horizonBaseLayer.set("order", 0);
                       horizonBaseLayer.set("isLocked", true);
                       horizonBaseLayer.set("name", "Default Basemap");
                       horizonBaseLayer.set("title", "Default Basemap");
                       horizonBaseLayer.set("url", null);
                       horizonBaseLayer.set("exactEarthOptions", { 
                           isBaseLayer: true, 
                           wrapDateLine: true,
                           transitionEffect: "resize",
                           tileOptions: {crossOriginKeyword: null}
                       });

                       horizonLayer.set("isExactEarth", true);
                       horizonLayer.set("mapType", "WMS");
                       horizonLayer.set("active", true);
                       horizonLayer.set("isLocked", true);
                       horizonLayer.set("order", 0);

                       horizonLayer.set("url", "https://owsdemo.exactearth.com/wms?authKey=tokencoin");
                       horizonLayer.set("exactEarthParams", { 
                           LAYERS : "exactAIS:LVI",
                           STYLES : "VesselByType",
                           FORMAT : "image/png",
                           TRANSPARENT : true,
                           SERVICE: "WMS",
                           VERSION: "1.1.1",
                           REQUEST: "GetMap"
                       });
                       horizonLayer.set("exactEarthOptions", { 
                           singleTile: false,
                           ratio: 1,
                           yx: { 'EPSG:4326': true },
                           wrapDateLine: true
                       });

                       view.model.addLayer(defaultBaseLayer);
                       view.model.addLayer(defaultLayer);
                       view.model.setBaseLayer(defaultBaseLayer);

                       horizonBaseLayer.save(null, {
                           url: "/api/layers/save",
                           success: function(res) {
                               console.log("Successfully saved default base layer");
                           },
                           error: function(res) {
                               console.log("ERROR when saving default base layer");
                           }
                       });

                       horizonLayer.save(null, {
                           url: "/api/layers/save",
                           success: function(res) {
                               console.log("Successfully saved default layer");
                           },
                           error: function(res) {
                               console.log("ERROR when saving default layer");
                           }
                       });
                   }
                   if (renderWhenDone)
                       view.render();
               }
           });
       },

        render: function () {

            var controlsView = new TopToolsRow(),
                graticuleControl,
                map = this.model,
                view = this;

            controlsView.render();
            this.addSubView(controlsView);

            OpenLayers.ProxyHost = "proxy?url=";

            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            OpenLayers.Util.onImageLoadError = function () { }

            map.events.register("mousemove", map, function(e) { 
                var latlon = map.getLonLatFromViewPortPx(e.xy) ;
                latlon.transform( map.projection, map.displayProjection);
                OpenLayers.Util.getElement("coordinates").innerHTML = latlon.lat + ", " + latlon.lon;
            });
            map.events.register("moveend", map, function(e) {
                var view = this;
                /*
                Utils.getShipCount(map.getExtent(), map.getLayersByName("exactAIS:LVI")[0].params.FILTER, function(count) {
                    view.shipCount = count;
                    if (count < 500)
                        Backbone.globalEvents.trigger("refreshShipList", count);
                    else
                        Backbone.globalEvents.trigger("tooManyShipsToFetch", count);
                });
                */
            });
            this.model.render("map");
            this.model.setCenter(new OpenLayers.LonLat(private.Lon2Merc(0), private.Lat2Merc(25)), 3);
            this.model.zoomToMaxExtent();
            Backbone.globalEvents.trigger("hideLoader");

            window.map = map; //BAD BAD BAD BAD but easy to manipulate the map through the console.
        }
    });

    return MapView;
});
