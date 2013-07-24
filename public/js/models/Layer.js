define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Layer = Backbone.Model.extend({
        idAttribute: "_id",

        initialize: function(attributes) {
        },

        initAsBaseLayer: function() {
            this.set("isBaseLayer", true);
            this.set("mapType", "OSM");
            this.set("active", true);
            this.set("order", 0);
            this.set("url", null);
            this.set("exactEarthOptions", { 
                isBaseLayer: true, 
                wrapDateLine: true,
                transitionEffect: "resize",
                tileOptions: {crossOriginKeyword: null}
            });
        },

        initAsLVILayer: function() {
            this.set("isExactEarth", true);
            this.set("mapType", "WMS");
            this.set("active", true);
            this.set("order", 0);

            this.set("url", "https://owsdemo.exactearth.com/wms?authKey=tokencoin");
            this.set("exactEarthParams", { 
                LAYERS : "exactAIS:LVI",
                STYLES : "VesselByType",
                FORMAT : "image/png",
                TRANSPARENT : true,
                SERVICE: "WMS",
                VERSION: "1.1.1",
                REQUEST: "GetMap"
            });
            this.set("exactEarthOptions", { 
                singleTile: false,
                ratio: 1,
                yx: { 'EPSG:4326': true },
                wrapDateLine: true
            });
        },

        setLayerType: function(eeLayerType) {
            this.set("exactEarthLayerType", eeLayerType);
            this.get("exactEarthParams").LAYERS = eeLayerType;
        },

        update: function(success, fail, context) {
            this.save(null, { 
                url: "/api/layers/" + this.get("_id") + "/update",
                success: function(data) {
                    if (success) success(data, context);
                },
                fail: function(err) {
                    if (fail) fail(err, context);
                }
            });
        }
    });

    return Layer;

});


