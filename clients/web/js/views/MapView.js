define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/mapTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, mapTemplate, jQueryCookie) {

    var MapView = Backbone.View.extend({

        tagName: 'div',
        className: '',

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
                maxBounds: [
                    [-180, -180],
                    [180, 180]
                ]
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
                    title: "You are here"
                }
            });
            // create nearest 5 beaches
            for (i in this.collection.models) {
                var color = "#000000"
                var status = this.collection.models[i].attributes.lastRating
                if (status == 0) {
                    color = "#347C17"
                } else if (status == 1) {
                    color = "#FBB917"
                } else if (status == 2) {
                    color = "#E42217"
                }
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [this.collection.models[i].attributes.lon, this.collection.models[i].attributes.lat]
                    },
                    properties: {
                        'marker-color': color,
                        title: this.collection.models[i].attributes.beachName,
                        url: "#info/" + [this.collection.models[i].attributes._id]
                    }
                });
            }
            // custom popup
            map.featureLayer.on('layeradd', function (e) {
                var marker = e.layer,
                    feature = marker.feature;
                // Create custom popup content
                if (feature.properties.url != undefined) {
                    var popupContent = '<a style="text-align: center; font-size: 22px; display: block;" href="' + feature.properties.url + '">' + feature.properties.title + '</a>';
                } else {
                    var popupContent = '<p style="text-align: center; font-size: 22px;">' + feature.properties.title + '</p>'
                }
                // http://leafletjs.com/reference.html#popup
                marker.bindPopup(popupContent, {
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
            $('#search').keyup(search);

            function search() {
                // get the value of the search input field
                var searchString = $('#search').val().toLowerCase();
                // Set the filter based on show state 
                map.featureLayer.setFilter(showState);
                // Set the boundaries of the map as you search
                map.fitBounds(map.featureLayer.getBounds())
                // here we're simply comparing the 'state' property of each marker
                // to the search string, seeing whether the former contains the latter.
                function showState(feature) {
                    // show state takes in each feature and if the function below this is true, it will display the feature, otherwise it will hide it
                    return feature.properties.title.toLowerCase().slice(0, searchString.length) == searchString.toLowerCase();
                }
            }
        },

        render: function () {
            this.$el.html(mapTemplate);
            return this;
        },

    });

    return MapView;

});