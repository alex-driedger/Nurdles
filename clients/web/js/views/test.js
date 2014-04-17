
            var map = L.mapbox.map('map', 'examples.map-9ijuk24y', {
                minZoom: 1,
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
            var markers = new L.MarkerClusterGroup();
                // Create markers
                var marker = L.marker(new L.LatLng(41.969073, 5), {
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'circle',
                    }),
                });
                markers.addLayer(marker);
                var marker = L.marker(new L.LatLng(41.969073, 7), {
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'circle',
                    }),
                });

                markers.addLayer(marker);
            map.addLayer(markers);