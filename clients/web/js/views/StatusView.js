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
        map: function () {
            document.getElementById("mapButton").className += " disabled";
            document.getElementById("search").style.display = "none";
            document.getElementById("back").style.width = "100%";
            document.getElementById("listButton").className = document.getElementById("listButton").className.replace(" disabled", "")
            $("#view").html(_.template(mapTemplate, {
                attributes: this.attributes
            }));
            this.renderMap();
        },
        list: function () {
            document.getElementById("search").style.display = "inline-block";
            document.getElementById("back").style.width = "80%";
            document.getElementById("listButton").className += " disabled"
            document.getElementById("mapButton").className = document.getElementById("mapButton").className.replace(" disabled", "")
            $("#view").html(_.template(beachTemplate, {
                attributes: this.attributes.slice(0, 50)
            }));
        },
        renderMap: function () {
            document.getElementById("map").style.top = $("#header").height();
            that = this
            console.log(this.lat)
            var map = L.mapbox.map('map', 'examples.map-9ijuk24y', {
                // Even though it says min zoom, this is really the max zoom-out. 0 being the highest.
                minZoom: 1,
                // Base location
                center: [that.lat, that.lon],
                // Base zoom
                zoom: 12,
                // No zoom buttons
                zoomControl: false,
                // Make it easier to tap 
                tapTolerance: 30,
                // Limit how far you can scroll to 1 map
                maxBounds: [
                    [-180, -180],
                    [180, 180]
                ]
            })
            // Prevent having a bunch of maps together
            map.tileLayer.options.noWrap = true
            // This unclusters everything at zoom level 1
            var markers = new L.MarkerClusterGroup({
                disableClusteringAtZoom: 12,
            });

            for (i in this.collection.models) {
                // Set color of marker
                var color = "#3AF"
                var status = this.collection.models[i].attributes.lastRating
                if (status == "Clean") {
                    color = "#347C17"
                } else if (status == "Moderately Clean") {
                    color = "#FBB917"
                } else if (status == "Dirty") {
                    color = "#E42217"
                }

                // Create markers
                var title = this.collection.models[i].attributes.beachName
                var marker = L.marker(new L.LatLng(this.collection.models[i].attributes.lat, this.collection.models[i].attributes.lon), {
                    icon: L.mapbox.marker.icon({
                        'marker-color': color,
                        'marker-symbol': 'circle',
                        'custom-marker-size': [window.innerWidth/9,window.innerHeight/3],
                        'title': this.collection.models[i].attributes.beachName,
                        'url': "#info/" + [this.collection.models[i].attributes._id]
                    }),
                });

                var popupContent = '<a style="text-align: center; font-size: 22px; display: block;" href="#info/' + this.collection.models[i].attributes._id + '">' + this.collection.models[i].attributes.beachName + '</a>';
                marker.bindPopup(popupContent, {
                    closeButton: false
                });


                markers.addLayer(marker);
            }
                var marker = L.marker([this.lat,this.lon], {
                    icon: L.mapbox.marker.icon({
                        'marker-color': "#3AF",
                        'marker-symbol': 'building',
                        'custom-marker-size': [window.innerWidth/9,window.innerHeight/3]
                    }),
                });

                var popupContent = '<p style="text-align: center; font-size: 22px;">You Are Here</p>';
                marker.bindPopup(popupContent, {
                    closeButton: false,
                })
            markers.addLayer(marker);
            map.addLayer(markers);
            markers.on('click', function (a) {
                map.panTo(a.layer.getLatLng())
            });
            initializeAutocomplete(BeachModel, "searchMap", "beachName", 5, false, false, searchByName)
            $("#searchMap").keyup(function()
            {
                if ($("#searchMap").val() == "")
                {
                map.setZoom(1)
                }
            })
            function searchByName(lat, lon) {
                map.removeLayer(markers);
                map.setZoom(12, false)
                map.panTo([lat, lon])

                map.on('zoomend', function() {
                   map.panTo([lat, lon])
                });
                map.addLayer(markers);
        }
        map.on("click", function(events)
        {
            alert(Math.round(events.latlng.lat)+"   ,   "+Math.round(events.latlng.lng))
        })
        markers.on("click", function(events)
        {
            alert("MARKER "+Math.round(events.latlng.lat)+"   ,   "+Math.round(events.latlng.lng))
        })
        $('*').click(function(e) {
alert(e.target.attributes.class.nodeValue)
});
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
                attributes: attributes.slice(0, 50)
            }));
            return this;
        },

    });

    return StatusView;

});