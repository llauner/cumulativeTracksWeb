var _tracksGeojson = null;
var _layerVectorTracks = null;

var vectorTracksStyle = {
    "color": "rgba(33, 78, 184, 0.65)",
    "weight": 1,
    "opacity": 0.65
};

/**
 * setupVectorTracks
 *
 */
function setupVectorTracks() {
	var zipVectorTracksUrl = NetcoupeTracksDataUrl + ZipGeojsonTracksFileName;
	_map.spin(true);
	JSZipUtils.getBinaryContent(zipVectorTracksUrl, function(err, data) {
		if(err) {
			toastr["error"]("Could not load ZIP Vector Tracks: " + zipVectorTracksUrl);
			setupVectorTracks_Fallback()
			throw err;
		}
		JSZip.loadAsync(data).then(function (zip) {
			zip.file(GeojsonTracksFileName).async("string")
			.then(function (data) {
				if (typeof (data) !== 'object') {
					data = JSON.parse(data);
				}
				_tracksGeojson = data;
				configureVectorTracks();
			})
			.finally(function() {
				_map.spin(false);
				if (!_tracksGeojson) {
					setupVectorTracks_Fallback();
				}
			});
		});
	});
}

/**
 * setupVectorTracks
 *
 */
function setupVectorTracks_Fallback() {
	var message = "Loading Vector tracks from .zip failed. Falling back to normal ..."
	console.log(message);
	toastr["warning"](message);
	// --- Get Netcoupe OpenAir airsapce ---
	var vectorTracksUrl = NetcoupeTracksDataUrl + GeojsonTracksFileName;
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

function updateVectorTracksStyle(color, opacity) {
	vectorTracksStyle.color = color;
	vectorTracksStyle.opacity = opacity;
	_layerVectorTracks.setStyle(vectorTracksStyle);
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
