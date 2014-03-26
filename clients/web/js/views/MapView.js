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
             // Create current location point
                features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [this.lon, this.lat]
                        },
                        properties: {
                            'marker-color': '#3AF',
                            'marker-symbol': 'embassy',
                            'marker-size': 'large',
                            title: "You Are Here"
                        }
                    });
                // create nearest 5 beaches
            for (i in this.collection.models) {
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [this.collection.models[i].attributes.lon, this.collection.models[i].attributes.lat]
                        },
                        properties: {
                            'marker-color': '#000',
                            title:[this.collection.models[i].attributes.beachName],
                            url: "#info/" + [this.collection.models[i].attributes._id]
                        }
                    });
            }
            
            // custom popup
            map.featureLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

    // Create custom popup content
    if (feature.properties.url != undefined)
    {
        var popupContent =  '<a style="text-align: center; display: block;" href="' + feature.properties.url + '">'+feature.properties.title+'</a>';
    } else
    {
        var popupContent = '<p>'+feature.properties.title+'</p>'
    }
    // http://leafletjs.com/reference.html#popup
    marker.bindPopup(popupContent,{
        closeButton: false
    });
});
              // Set the feature layers data so that it knows what featuers are on it
            map.featureLayer.setGeoJSON({
                type: 'FeatureCollection',
                features: features
            });
            // Zoom/move the map to fit the markers
            map.fitBounds(map.featureLayer.getBounds())
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
