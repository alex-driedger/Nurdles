define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/mapTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, mapTemplate, jQueryCookie) {
    
    var MapView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.collection = options.collection
            this.lat = options.lat;
            this.lon = options.lon;
            this.render();
        },

        renderMap: function () {
            document.getElementById("map").style.top = $("#header").height() + 10;
            var map = L.mapbox.map('map', 'examples.map-9ijuk24y', {
                minZoom: 2,
                maxBounds: [[-180, -180], [180, 180]]
            }).addControl(L.mapbox.geocoderControl('examples.map-9ijuk24y'));
            var features = [];
            console.log(this.collection)
             // Create a bunch of points
                features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [this.lon, this.lat]
                        },
                        properties: {
                            'marker-color': '#3AF',
                            'marker-size': 'small',
                            title: "You Are Here"
                        }
                    });
            for (i in this.collection.models) {
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [this.collection.models[i].attributes.lon, this.collection.models[i].attributes.lat]
                        },
                        properties: {
                            'marker-color': '#000',
                            'marker-size': 'small',
                            title: [this.collection.models[i].attributes.beachName]
                        }
                    });
            }
             // Set the feature layers data so that it knows what featuers are on it
            map.featureLayer.setGeoJSON({
                type: 'FeatureCollection',
                features: features
            });
             // On click, pan to the point
            map.featureLayer.on('click', function (e) {
                map.panTo(e.layer.getLatLng());
            });
             // No repeating maps
            map.tileLayer.options.noWrap = true 
            L.mapbox.featureLayer().on('ready', function() {
                map.fitBounds(L.mapbox.featureLayer().getBounds());
            });
        },

        render: function () {
            this.$el.html(mapTemplate);
            return this;
        },
        
    });
    
    return MapView;
    
});
