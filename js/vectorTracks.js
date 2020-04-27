var _tracksGeojson = null;
var _layerVectorTracks = null;

var vectorTracksStyle = {
    "color": "#4287f5",
    "weight": 1,
    "opacity": 0.65
};

/**
 * setupVectorTracks
 *
 */
function setupVectorTracks() {
	// --- Get Netcoupe OpenAir airsapce ---
	var vectorTracksUrl = NetcoupeAirspaceDataUrl + GeojsonTracksFileName;
	_map.spin(true);
    $.ajax({
        url: vectorTracksUrl,
        type: 'GET',
        context: document.body,
        dataType: "json",
        success: function(result) {
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
			_tracksGeojson = result;
			configureVectorTracks();
        },
        error: function(result, status, errorThrown) {
            console.log(errorThrown);
            toastr["error"]("Could not load Vector Tracks: " + vectorTracksUrl);
		},
		complete: function(jqXHR, textStatus) {
			_map.spin(false);
		}
	});
}

function configureVectorTracks() {
	_layerVectorTracks = L.geoJSON(_tracksGeojson, {
		style: vectorTracksStyle
	}).addTo(_map);
}

/**
 * showHideVectorTracks
 *
 * @param {*} isVector
 */
function showHideVectorTracks(show) {
	if (_layerVectorTracks)
		if (show) {
			_layerVectorTracks.addTo(_map)
		}
		else {
			_layerVectorTracks.remove()
		}
}
