
function setupTracksMetadata(silent=false) {
	// ----- Load MetaData -----
    var baseUrl = (_alternativeSource)
        ? `${GcpStorageBucketAlternativeSourceEndpoint}/${_alternativeSource}/` : NetcoupeTracksDataUrl;
				
	var tracksMetadataUrl = baseUrl + _selectedDayFilenames.TracksMetaDataFileName;
	if (!silent) {
		_map.spin(true);
	}
	$.ajax({
				url: tracksMetadataUrl,
				type: 'GET',
				context: document.body,
				success: function(result) {
					// Get result metadata
					if (typeof (result) !== 'object') {
						result = JSON.parse(result);
					}
					metadata = result;
					targetDate = moment(metadata.targetDate);
					startDate = moment(metadata.script_start_time);
					endDate = moment(metadata.script_end_time);

					targetDateToDisplay = targetDate.format("DD/MM/YYYY");
					startDateToDisplay = startDate.format("DD/MM/YYYY HH:mm:ss");
					duration = moment(endDate.diff(startDate)).format("mm:ss");
					flightsCount = metadata.flightsCount;
					processedFlightsCount = metadata.processedFlightsCount;

					// --- Init interface ---
					// --- Populate information panel
					$('#target-date').html(targetDateToDisplay);
					$('#start-date').html(startDateToDisplay);
					$('#duration').html(duration);
					$('#flights-count').html(flightsCount);
					$('#processed-flights-count').html(processedFlightsCount);
				},
				complete: function(jqXHR, textStatus) {
					_map.spin(false);
				}
			});
}
