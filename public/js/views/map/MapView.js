define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/map/MapView.html'
], function($, _, Backbone, mapTemplate){
    var MapView = Backbone.View.extend({

        render: function () {
            this.$el.html(mapTemplate);

            var map = new OpenLayers.Map("map");

            var ol_wms = new OpenLayers.Layer.WMS(
                "OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0",
                    {layers: "basic"}
            );

            console.log("STUFF: ", map.size);

            var dm_wms = new OpenLayers.Layer.WMS(
                "Exact Earth Data",
                "https://owsdemo.exactearth.com/wms?service=WMS&version=1.3.0&request=GetMap&authKey=tokencoin",
                {
                    layers: "exactAIS:LVI",
                    crs: "crs:84",
                    height: map.size.h,
                    width: map.size.w,
                    format: "image/png",
                    transparent: true
                },
                {isBaseLayer: false, visibility: true}
            );

            map.addLayers([ol_wms, dm_wms]);
            map.zoomToMaxExtent();

            console.log(map);
            return this;
        }
    });

    return MapView;
});
