define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/statusTemplate.html',
    'text!templates/beachTemplate.html',
    'text!templates/mapTemplate.html',
    'models/Beach',
    'jquerycookie',
], function ($, _, Backbone, statusTemplate, beachTemplate, mapTemplate, BeachModel, jQueryCookie) {

    var StatusView = Backbone.View.extend({

        // redirect is used on successful create or update.
        events: {
            'click #mapButton': 'map',
            'click #listButton': 'list'
        },
        map: function() {
            document.getElementById("mapButton").className += " disabled";
            document.getElementById("search").style.display = "none";
            document.getElementById("back").style.width = "100%";
            document.getElementById("listButton").className = document.getElementById("listButton").className.replace(" disabled", "")
            $("#view").html(_.template(mapTemplate, {
                attributes: this.attributes
            }));
            this.renderMap();
        },
        list: function() {
            document.getElementById("search").style.display = "inline-block";
            document.getElementById("back").style.width = "80%";
            document.getElementById("listButton").className += " disabled"
            document.getElementById("mapButton").className = document.getElementById("mapButton").className.replace(" disabled", "")
            $("#view").html(_.template(beachTemplate, {
                attributes: this.attributes.slice(0,50)
            }));
        },
        renderMap: function() {
            document.getElementById("map").style.top = $("#header").height();
            var map = L.mapbox.map('map', 'examples.map-9ijuk24y', {
                minZoom: 2,
                zoomControl: false,
                maxBounds: [
                    [-180, -180],
                    [180, 180]
                ]
            })
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
                    'custom-marker-size': [window.innerHeight/10, window.innerHeight/5],
                    title: "You are here"
                }
            });
            // create nearest 5 beaches
            for (i in this.collection.models) {
                var color = "#000000"
                var status = this.collection.models[i].attributes.lastRating
                if (status == "Clean") {
                    color = "#347C17"
                } else if (status == "Moderately Clean") {
                    color = "#FBB917"
                } else if (status == "Dirty") {
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
                        'custom-marker-size': [window.innerHeight/10, window.innerHeight/5],
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
            initializeAutocomplete(BeachModel, "searchMap", "beachName", 5, false, false, searchByName)
            $("#searchMap").keyup(function()
            {
                if ($("#searchMap").val() == "")
                {
                    searchByName();
                }
            })
            function searchByName() {
                // get the value of the search input field
                var searchString = $('#searchMap').val().toLowerCase();
                // Set the filter based on show state 
                map.featureLayer.setFilter(showState);
                // Set the boundaries of the map as you search
                if (map.featureLayer.getBounds()._northEast != undefined)
                {
                    map.fitBounds(map.featureLayer.getBounds())
                }
                // here we're simply comparing the 'state' property of each marker
                // to the search string, seeing whether the former contains the latter.
                function showState(feature) {
                    // show state takes in each feature and if the function below this is true, it will display the feature, otherwise it will hide it
                    return feature.properties.title.toLowerCase().slice(0, searchString.length) == searchString.toLowerCase();
                }
            }
        },
        initialize: function (options) {
            this.lat = options.lat
            this.lon = options.lon
            this.collection = options.collection
            this.render();
        },
        render: function () {
            var attributes = []
            // THIS IS WHERE U DO THE LAT LON LOCATION STUFF
            for (i in this.collection.models) {
                attributes.push(this.collection.models[i].attributes)
                switch (attributes[i].lastRating) {
                case 0:
                    attributes[i].lastRating = "Clean"
                    break
                case 1:
                    attributes[i].lastRating = "Moderately Clean"
                    break
                case 2:
                    attributes[i].lastRating = "Dirty"
                    break
                default:
                    attributes[i].lastRating = "Unknown"
                }
            }
            this.attributes = attributes
            this.$el.html(_.template(statusTemplate, {
                attributes: attributes.slice(0,50)
            }));
            return this;
        },

    });

    return StatusView;

});