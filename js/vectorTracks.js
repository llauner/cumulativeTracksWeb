var _availableTracks = null;            // List of available days
var _tracksGeojson = null;
var _layerVectorTracks = null;
var _selectedDayIndex = null;
var _selectedDayFilenames = null;


var vectorTracksStyle = {
	"color": "rgba(33, 78, 184, 0.65)",
	"weight": 1,
	"opacity": 0.65
};

/**
 * discoverAvailableTracks
 * @param {any} silent
 */
function discoverAvailableTracks(silent = false) {
	var availableTracksUrl = IgcRestApiEndpoint + IgcRestApiAvailableTracksUrl;
	if (!silent) {
		_map.spin(true);
	}

	$.ajax({
		url: availableTracksUrl,
		type: 'GET',
		context: document.body,
		dataType: "json",
		success: function (result) {
			_availableTracks = result.result;
			if (_availableTracks.length == 0) {
				toastr["error"]("No cumulative Tracks available !");
			}
			else {
				setupDatePickerDialog();
				selectTrack();		// Get latest track by default
			}
		},
		error: function (result, status, errorThrown) {
			console.log(errorThrown);
			toastr["error"]("Could not load Vector Tracks: " + vectorTracksUrl);
		},
		complete: function (jqXHR, textStatus) {
			_map.spin(false);
		}
	});

}


/**
 * selectTrack
 * @param {any} pickerDate
 */
function selectTrack(pickerDate) {
	var targetAvailableDay = null;
	if (!pickerDate) {
		targetAvailableDay = _availableTracks[_availableTracks.length - 1];
	}
	else {
		targetAvailableDay = pickerToTrack(pickerDate);
	}

	_selectedDayFilenames = getFilenamesForTargetDate(targetAvailableDay);

	showHideVectorTracks(false);
	setupVectorTracks();
	setupTracksMetadata();
}

/**
 * setupVectorTracks
 * @param {any} silent
 */
function setupVectorTracks(silent = false) {
	var zipVectorTracksUrl = NetcoupeTracksDataUrl + _selectedDayFilenames.ZipGeojsonTracksFileName;
	if (!silent) {
		_map.spin(true);
	} 
	JSZipUtils.getBinaryContent(zipVectorTracksUrl, function(err, data) {
		if(err) {
			toastr["error"]("Could not load ZIP Vector Tracks: " + zipVectorTracksUrl);
			console.log(err);
			setupVectorTracks_Fallback();
			_map.spin(false);
		}
		JSZip.loadAsync(data).then(function (zip) {
			zip.file(_selectedDayFilenames.VectorGeojsonTracksFileName).async("string")
			.then(function (data) {
				if (typeof (data) !== 'object') {
					data = JSON.parse(data);
				}
				_tracksGeojson = data;
				configureVectorTracks(silent);
				enableTrackSelection();
			})
			.finally(function() {
				_map.spin(false);
				if (!_tracksGeojson) {
					setupVectorTracks_Fallback(silent);
				}
			});
		});
	});
}


/**
 * setupVectorTracks
 *
 */
function setupVectorTracks_Fallback(silent = false) {
	// --- Get Netcoupe OpenAir airsapce ---
	var vectorTracksUrl = NetcoupeTracksDataUrl + VectorGeojsonTracksFileName;
	if (!silent) {
		var message = "Loading Vector tracks from .zip failed. Falling back to normal ..."
		console.log(message);
		toastr["warning"](message);
		_map.spin(true);
	}
	
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
			configureVectorTracks(silent);
			enableTrackSelection();
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

function configureVectorTracks(silent = false) {
	_layerVectorTracks = L.geoJSON(_tracksGeojson, {
		style: vectorTracksStyle
	});
	if (!silent) {
		_layerVectorTracks.addTo(_map);
	} 
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
