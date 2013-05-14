define([
       'baseview',
       'basecollection',
       'openlayersutil',
       '../../models/Layer',
       './FeaturePopup',
       '../partials/map/TopToolsRow',
       'text!templates/map/MapView.html',
], function(BaseView, BaseCollection, OpenLayersUtil, Layer, FeaturePopup, TopToolsRow, mapTemplate){
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

        setHtml: function(response) {
            console.log();
            if (response.text.indexOf("MMSI") >= 0) {
                $("#dialog").html(response.text);
                $("#dialog").addClass("onTop").removeClass("hide");
            }
        },

        showInfo: function(evt, view) {
            if (evt.features && evt.features.length > 0)
                private.onFeatureSelect(evt, view.model, view);
        },

        loadingLayers: 0,

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
            var latLongOfClick = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y));

            var featureInfo = evt.features[0],
                bounds = null;

            //We need to transform the points to properly place the popup
            featureInfo.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"))

            //If we're dealing with a point feature, we won't have getBounds so 
            //We'll need to create our bounds before grabbing the center LonLat
            //TODO: Maybe make this suck less
            if (featureInfo.geometry.getBounds())
                bounds = featureInfo.geometry.getBounds();
            else
                bounds = featureInfo.geometry.createBounds();

            console.log(latLongOfClick);
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
                    new OpenLayers.Control.Zoom({ 'position': new OpenLayers.Pixel(50, 50) }),
                    new OpenLayers.Control.Navigation()
                ],
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
                numZoomLevels: 18,
                maxResolution: 156543,
                units: 'meters'
            });
            this.userLayers = new BaseCollection([], {model: Layer});

            this.isHeaderViewable = true;
            this.bindTo(Backbone.globalEvents, "filtersChanged", this.updateFilters, this);
            this.bindTo(Backbone.globalEvents, "toggleGraticule", this.toggleGraticule, this);

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

        showLoader: function(e) {
            private.loadingLayers++
            $("#loader").removeClass("hide");
        },

        hideLoader: function(e) {
            private.loadingLayers--;
            if (private.loadingLayers === 0)
                $("#loader").addClass("hide");
        },

        updateFilters: function(filters) {
            var map = this.model;

            var exactAISLayer = map.getLayersByName("exactAIS")[0];

            exactAISLayer.params["FILTER"] = this.createOpenLayersFilters(filters);
            exactAISLayer.redraw();
        },

        createOpenLayersFilters: function(filters) {
            console.log(filters);
            var olFilters = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND 
            });

            for (var i = 0, len = filters.length; i< len; i++) {
                for (var j = 0, olen = filters[i].get("operators").length; j < olen; j++) {
                    olFilters.filters.push(filters[i].get("operators")[j]);
                }
            }

            var filter_1_0 = new OpenLayers.Format.Filter({version: "1.1.0"});
            var xml = new OpenLayers.Format.XML(); 
            var filter_param = xml.write(filter_1_0.write(olFilters));
            console.log(filter_param);

            return filter_param;
        },

        toggleGraticule: function(activate) {
            _.each(this.model.controls, function(control) {
                if (control.layerName && control.layerName === "Graticule") {
                    if (activate)
                        control.activate();
                    else
                        control.deactivate();
                    return
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
            _.each(eeLayers, function(eeLayer) {
                var layer,
                    userLayer = userLayers.findWhere({name: eeLayer.Name});
                if (userLayer && userLayer.get("active") && userLayer.get("exactEarthParams")) {
                    layer = new OpenLayers.Layer.WMS(
                        eeLayer.Name, "https://owsdemo.exactearth.com/wms?authKey=tokencoin",
                        userLayer.get("exactEarthParams"),
                        {
                            singleTile: false,
                            ratio: 1,
                            isBaseLayer: eeLayer.isBaseLayer,
                            yx: { 'EPSG:4326': true },
                            wrapDateLine: true
                        }
                    );

                    layersToAddToMap.push(layer);
                }
            });

            view.model.addLayers(layersToAddToMap);
        },

        getUserLayers: function(eeLayers, view) {
            view.userLayers.fetch({
                url: "/api/layers/getAllForUser",
                success: function(userLayers, res, opt) {
                    view.addActiveLayersToMap(eeLayers, userLayers, view);
                }
            });
        },

        addControlsToMap: function() {
            var view = this,
            oInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: 'https://owsdemo.exactearth.com/wms?authKey=tokencoin',
                    title: 'Identify features by clicking',
                    infoFormat: "application/vnd.ogc.gml",
                    queryVisible: true,
                    eventListeners: {
                        getfeatureinfo: function(evt) {
                            private.showInfo(evt, view);
                        }
                    }
                });

                this.model.addControl(oInfoControl);
                oInfoControl.activate();
        },

        render: function () {
            this.$el.html(mapTemplate);

            var controlsView = new TopToolsRow(),
                graticuleControl,
                map = this.model,
                _Layer_WMS;

            controlsView.render();
            this.addSubView(controlsView);

            OpenLayers.ProxyHost = "proxy?url=";

            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            map.render("map");

            graticuleControl = new OpenLayers.Control.Graticule({
                numPoints: 2,
                labelled: true,
                autoActivate: false
            });

            map.addControl(graticuleControl);

            OpenLayers.Util.onImageLoadError = function () { }
            var basicMapLayer = new OpenLayers.Layer.WMS("Basic Base Map", "http://vmap0.tiles.osgeo.org/wms/vmap0", 
                    {layers: "basic"}, 
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize"
                    });

            map.addLayers([basicMapLayer]);


            map.events.register("mousemove", map, function(e) { 
                var latlon = map.getLonLatFromViewPortPx(e.xy) ;
                latlon.transform( map.projection, map.displayProjection);
                OpenLayers.Util.getElement("coordinates").innerHTML = latlon.lat + ", " + latlon.lon;
            });

            /*
            basicMapLayer.events.register("loadstart", this.model, this.showLoader);
            basicMapLayer.events.register("loadend", this.model, this.hideLoader);
            _Layer_WMS.events.register("loadstart", this.model, this.showLoader);
            _Layer_WMS.events.register("loadend", this.model, this.hideLoader);
            */

            map.setCenter(new OpenLayers.LonLat(private.Lon2Merc(0), private.Lat2Merc(25)), 3);

            map.zoomToMaxExtent();

            window.map = map; //BAD BAD BAD BAD but easy to manipulate the map through the console.
        }
    });

    return MapView;
});
