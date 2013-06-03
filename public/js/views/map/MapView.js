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
            this.bindTo(Backbone.globalEvents, "getShipList", this.getShipList, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", function() {
                if (view.cachedSearchedShips)
                    setTimeout(function() {
                        Backbone.globalEvents.trigger("cachedSearchedShipsExist", view.cachedSearchedShips);
                    }, 5); //We want this to happen after other event handlers have been initiated so we make it start a bit later.
                    //This allows us to make sure the view that handles the event is the view that was loaded from clicking on shiplist on the side bar.
            }, this);
            this.bindTo(Backbone.globalEvents, "cacheSearchedShips", function(ships) {view.cachedSearchedShips = ships;}, this);

            OpenLayersUtil.addControlsToMap(this);
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

        getShipList: function() {
            var filter,
                map = this.model,
                mapFilter = map.getLayersByName("exactAIS:LVI")[0].params.FILTER;

            filter = new OpenLayers.Filter.Spatial({ 
                type: OpenLayers.Filter.Spatial.BBOX, 
                property: "position", 
                value: map.getExtent().transform(map.projection, map.displayProjection)
            });

            filter = OpenLayersUtil.mergeActiveFilters(filter, mapFilter);

            var  wfsProtocol = new OpenLayers.Protocol.WFS.v1_1_0({ 
                url: "/proxy/getWFSFeatures?url=https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=exactAIS:LVI&authKey=tokencoin", 
                featurePrefix: "", 
                featureType: "exactAIS:LVI",
            }); 

            Backbone.globalEvents.trigger("showLoader");

            wfsProtocol.read ({ 
                filter: filter, 
                callback: function(response) {
                    Backbone.globalEvents.trigger("hideLoader");
                    Backbone.globalEvents.trigger("fetchedShipsList", response.features);
                },
                scope: new OpenLayers.Strategy.Fixed
            }); 
            
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

            filter = OpenLayersUtil.mergeActiveFilters(filter, map.getLayersByName("exactAIS:LVI")[0].params.FILTER);

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

        processQuery: function(response) {
            Backbone.globalEvents.trigger("hideLoader");
            Backbone.globalEvents.trigger("fetchedSearchedShips", response.features);
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

        getUserLayers: function(eeLayers, view) {
            view.userLayers.fetch({
                url: "/api/layers/getAllForUser",
                success: function(userLayers, res, opt) {
                    OpenLayersUtil.addActiveLayersToMap(eeLayers, userLayers, view);
                    view.mapLoaded(view);
                }
            });
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
        },

        showInfo: function(evt, view) {
            if (evt.features && evt.features.length > 0)
                view.onFeatureSelect(evt, view.model, view);
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
                return layer.isBaseLayer;
            });
            var offset = map.layers.length - layers.length;

            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = map.getLayersByName(layerIds[i])[0];

                if (layerIds.indexOf(layer.name) == -1)
                    layer.setVisibility(false);
                else
                    map.setLayerIndex(layer, map.layers.length - i - 1);
            }
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
            var map = this.model,
                filtersForParam = [];

            var exactAISLayer = map.getLayersByName("exactAIS:LVI")[0],
                styles = exactAISLayer.params.STYLES.split(","),
                filterParam = this.createOpenLayersFilters(filters);

            this.filter = filterParam;

            if (styles.length > 1) {
                filterParam = "(" + filterParam + ")";
                for (var i = 0, len = styles.length; i < len; i++) {
                    filterParam += filterParam ; //Needed if we have applied multiple styles on a filtered layer 
                }
            }

            if (filters.length > 0) {
                exactAISLayer.mergeNewParams({"FILTER": filterParam});
            }
            else 
                exactAISLayer.mergeNewParams({"FILTER": ""});
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

        mapLoaded: function(view) {
            view.render();

            Backbone.globalEvents.trigger("layersFetched", view.userLayers, view.baseLayers);
            Backbone.globalEvents.trigger("eeStoredLayersFetched", view.eeStoredLayers);
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
            map.events.register("moveend", map, function(e) {
                Backbone.globalEvents.trigger("moveEnd");
            });
            map.events.register("zoomend", map, function(e) {
                Backbone.globalEvents.trigger("zoomEnd");
            });

            map.setCenter(new OpenLayers.LonLat(private.Lon2Merc(0), private.Lat2Merc(25)), 3);

            map.zoomToMaxExtent();

            window.map = map; //BAD BAD BAD BAD but easy to manipulate the map through the console.
        }
    });

    return MapView;
});
