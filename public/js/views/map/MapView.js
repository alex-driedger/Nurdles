define([
       'baseview',
       './FeaturePopup',
       '../partials/map/TopToolsRow',
       'text!templates/map/MapView.html',
], function(BaseView, FeaturePopup, TopToolsRow, mapTemplate){
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
            console.log($.parseJSON(response.text));
            if (response.text.indexOf("MMSI") >= 0) {
                $("#dialog").html(response.text);
                $("#dialog").addClass("onTop").removeClass("hide");
            }
        },

        showInfo: function(evt) {
            console.log(evt);
            if (evt.features && evt.features.length) {
                _Layer_Highlight.destroyFeatures();
                _Layer_Highlight.addFeatures(evt.features);
                _Layer_Highlight.redraw();
            }
            else {
                private.onFeatureSelect(evt, this.model, this);
            }
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

            var featurePopup = new FeaturePopup({
                shipInformation:  {
                    shipName: "This is the data"
                },
                map: map,
                position: latLongOfClick
            }, view);

            view.subviews.push(featurePopup);
            featurePopup.render(evt);
        },

        onFeatureUnselect: function() {
            feature = evt.feature;
            if (feature.popup) {
                popup.feature = null;
                map.removePopup(feature.popup);
                feature.popup.destroy();
                feature.popup = null;
            }
        }
    };

    var MapView = BaseView.extend({

        initialize: function(args) {
            this.isHeaderViewable = true;
            this.subviews = [];

            this.bindTo(Backbone.globalEvents, "filtersChanged", this.updateFilters, this);
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
            var olFilters = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND 
            });

            for (var i = 0, len = filters.length; i< len; i++) {
                for (var j = 0, olen = filters[i].get("operators").length; j < olen; j++) {
                    olFilters.filters.push(filters[i].get("operators")[j]);
                }
            }

            var filter_1_0 = new OpenLayers.Format.Filter({version: "1.0.0"});
            var xml = new OpenLayers.Format.XML(); 
            var filter_param = xml.write(filter_1_0.write(olFilters));

            return filter_param;
        },

        render: function () {
            this.$el.html(mapTemplate);

            var controlsView = new TopToolsRow(),
                _Map,
                _Layer_WMS, _Layer_Highlight, _Layer_Hover, _Layer_Select;


            controlsView.render();
            this.subviews.push(controlsView);

            OpenLayers.ProxyHost = "proxy?url=";

            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            _Map = new OpenLayers.Map('map', {
                controls: [],
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
                numZoomLevels: 18,
                maxResolution: 156543,
                units: 'meters'
            });

            this.model = _Map;

            _Map.addControl(new OpenLayers.Control.Zoom({ 'position': new OpenLayers.Pixel(50, 50) }));
            _Map.addControl(new OpenLayers.Control.Navigation());

            _Layer_WMS = new OpenLayers.Layer.WMS(
                "exactAIS", "https://owsdemo.exactearth.com/wms?authKey=9178ef5a-8ccd-45d3-8786-38901966a291",
                    {
                LAYERS: "exactAIS:LVI",
                STYLES: "VesselByType",
                format: "image/png",
                transparent: "true"
            },
            {
                singleTile: false,
                ratio: 1,
                isBaseLayer: false,
                yx: { 'EPSG:4326': true },
                wrapDateLine: true
            }
            );
            _Layer_WMS.setVisibility(true);

            OpenLayers.Util.onImageLoadError = function () { }
            var basicMapLayer = new OpenLayers.Layer.WMS("Basic Base Map", "http://vmap0.tiles.osgeo.org/wms/vmap0", 
                    {layers: "basic"}, 
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize"
                    });

                _Layer_Highlight = new OpenLayers.Layer.Vector("Highlighted Features", { displayInLayerSwitcher: false, isBaseLayer: false });
            _Layer_Select = new OpenLayers.Layer.Vector("Selected Features", { displayInLayerSwitcher: false, isBaseLayer: false });
            _Layer_Hover = new OpenLayers.Layer.Vector("Highlighted Features", { displayInLayerSwitcher: false, isBaseLayer: false });

            _Map.addLayers([basicMapLayer, _Layer_WMS, _Layer_Highlight, _Layer_Select, _Layer_Hover]);

            var oInfoControl = {
                click: new OpenLayers.Control.WMSGetFeatureInfo({
                    url: 'https://owsdemo.exactearth.com/wms?authKey=9178ef5a-8ccd-45d3-8786-38901966a291',
                    title: 'Identify features by clicking',
                    layers: [_Layer_WMS],
                    infoFormat: "application/vnd.ogc.gml",
                    queryVisible: true
                })
            };

            for (var i in oInfoControl) {
                oInfoControl[i].events.register("getfeatureinfo", this, private.showInfo);
                _Map.addControl(oInfoControl[i]);
            }
            oInfoControl.click.activate();

            _Map.events.register("mousemove", _Map, function(e) { 
                var latlon = _Map.getLonLatFromViewPortPx(e.xy) ;
                latlon.transform( _Map.projection, _Map.displayProjection);
                OpenLayers.Util.getElement("coordinates").innerHTML = latlon.lat + ", " + latlon.lon;
            });

            basicMapLayer.events.register("loadstart", _Map, this.showLoader);
            basicMapLayer.events.register("loadend", _Map, this.hideLoader);
            _Layer_WMS.events.register("loadstart", _Map, this.showLoader);
            _Layer_WMS.events.register("loadend", _Map, this.hideLoader);

            _Map.setCenter(new OpenLayers.LonLat(private.Lon2Merc(0), private.Lat2Merc(25)), 3);

            _Map.zoomToMaxExtent();
        }
    });

    return MapView;
});
