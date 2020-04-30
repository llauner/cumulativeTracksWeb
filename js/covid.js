var _isCovidFlavor = false;

const CovidCircleRadius = 100 * 1000;

// Covid circle style
const covidCircleStyle = { 
	color: '#15ad45',
	fillColor: '#15ad45'
};
function AddCovidCircle(lat,lon) {
	var layerCircle = L.circle([lat,lon], CovidCircleRadius, covidCircleStyle);
	_layerDraw.addLayer(layerCircle);

	var marker = L.marker([lat, lon]);
	_layerDraw.addLayer(marker);

	// Fly to location with zoom
	_map.flyTo(new L.LatLng(lat, lon),8.5);

	updateURL(lat, lon); // Add parameter to URL so that we can bookmark
}

function handleCovidUrlParameter(covidParam) {
		try {
			// Update interface
			$("#chk-vector-tracks").prop( "checked", false );              // Uncheck Tracks box
			$('#chk-vector-tracks').trigger('change');
			$('#chk-show-drawing-tools').prop( "checked", true );   // Check Drawing tools visible

			// Set drawing tools options
			_drawControlOptions.draw.rectangle = false;
			_drawControlOptions.draw.polyline = false;
			_drawControlOptions.draw.circle = false;
			configureDraw();
			// Show Drawing tools
			showHideDrawingTools(true);

			// Extract coordinates 
			if (covidParam) {
				var targetLocation = covidParam.split(",");
				var targetLat = targetLocation[0];
				var targetLon = targetLocation[1];
				// Draw Circle
				AddCovidCircle(targetLat, targetLon);
			}
		}
		catch (error) {
			console.log(error);
		}
}

/**
 * updateURL
 * Update URL in browser with right parameters so that we can bookmark the page
 * @param {*} lat
 * @param {*} lon
 */
function updateURL(lat,lon) {
	var paramCovid = `?covid=${lat},${lon}`
	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host  + paramCovid;
		window.history.pushState({path:newurl},'',newurl);
	}
  }