

function setupYearlyMbTiles() {
    var mapboxUrl = `https://thermalmap-tilehut-server-w4pyzgkhqa-od.a.run.app/${_targetYear}-tracks/{z}/{x}/{y}.pbf`;
    var layerId = `${_targetYear}tracks`;

    var mapboxVectorTileOptions = {
        rendererFactory: L.canvas.tile,
        vectorTileLayerStyles: { 
            [layerId]: function (properties, zoom) {
                var weight = 1;
                var opacity = 1;

                var trackIndex = (properties.flightId == undefined)
                    ? Math.floor(Math.random() * (20 - 1 + 1) + 1)
                    : properties.flightId;
                var trackColorcolor = "#" + _palette[trackIndex % _palette.length];

                // ----- Selected airport: hide needed tracks -----
                // Hide tracks without icao
                if (_currentAirportFilterValue && !properties.takeoff) {
                    trackColorcolor = 'rgba(0,0,0,0)';
                }

                // Hide tracks not selected
                if (_currentAirportFilterValue && properties.takeoff) {
                    if (!filterByTakeOffLocation(null, properties.takeoff)) {
                        trackColorcolor = 'rgba(0,0,0,0)';
                    }
                }

                return {
                    weight: weight,
                    color: trackColorcolor,
                    opacity: opacity
                }
            }
        }
    };

    _mapboxPbfLayer = L.vectorGrid.protobuf(mapboxUrl, mapboxVectorTileOptions);
    _mapboxPbfLayer.addTo(_map);

    setupTakeoffAirportSelecttion();
}