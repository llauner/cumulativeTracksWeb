var _layerRasterTracks = null;

function setupRasterTracks(silent=false) {
	// ----- Load MetaData -----
    var tracksMetadataUrl = NetcoupeTracksDataUrl + TracksMetaDataFileName;
    if (!silent) {
        _map.spin(true);
    }
    $.ajax({
                url: tracksMetadataUrl,
                type: 'GET',
                context: document.body,
                success: function(result) {
                    // Get result metadata
                    metadata = result;
                    tracksMetaData = result;
                    targetDate = moment(metadata.targetDate, "YYYY_MM_DD");
                    startDate = moment(metadata.startDate, "YYYY_MM_DD HH:mm:ss");

                    targetDateToDisplay = targetDate.format("DD/MM/YYYY");
                    startDateToDisplay = moment(startDate).format("DD/MM/YYYY HH:mm:ss");
                    duration = metadata.duration;
                    flightsCount = metadata.flightsCount;
                    processedFlightsCount = metadata.processedFlightsCount;

                    // --- Init interface ---
                    // --- Populate information panel
                    $('#target-date').html(targetDateToDisplay);
                    $('#start-date').html(startDateToDisplay);
                    $('#duration').html(duration);
                    $('#flights-count').html(flightsCount);
                    $('#processed-flights-count').html(processedFlightsCount);

                    //addImageOverlay(silent);  // Add tracks image overlay
                },
                complete: function(jqXHR, textStatus) {
                    _map.spin(false);
                }
            });
}

// ##################### DEPRECATED ########################################################################
function addImageOverlay(silent=false) {
    // add a marker in the given location
    //L.marker(tracksMetaData.boundingBoxUpperLeft).addTo(_map); 
    //L.marker(tracksMetaData.boundingBoxLowerRight).addTo(_map);
    
        var imageUrl = '/tracks/latest-tracks.png',
        imageBounds = [ tracksMetaData.boundingBoxUpperLeft, tracksMetaData.boundingBoxLowerRight];
        _layerRasterTracks = L.imageOverlay(imageUrl, imageBounds);
        
        // --- map Events ---
        // _map.on('moveend', showAirspaceLabels);
        _map.on('zoomend', showAirspaceLabels);
	};
	
/**
 * showHideVectorTracks
 *
 * @param {*} isVector
 */
function showHideRasterTracks(show) {
	if (_layerRasterTracks)
		if (show) {
			_layerRasterTracks.addTo(_map)
		}
		else {
			_layerRasterTracks.remove()
		}
}