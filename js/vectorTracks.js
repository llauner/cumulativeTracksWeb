var _availableTracks = null;            // List of available days
var _tracksGeojson = null;
var _layerVectorTracks = null;
var _selectedDayIndex = null;
var _selectedDayFilenames = null;
// --- Color palette ---
var _selectedPalette = "tol-rainbow";		// Current selected color palette name
var _selectedPaletteCount = 20;				// Number of different colors in the palette
var _palette = palette(_selectedPalette, _selectedPaletteCount);						// Current selected color palette

var _mapboxPbfLayer = null;

var _currentAirportFilterValue = null;

var vectorTracksStyle = {
						"color": "rgba(33, 78, 184)",
						"weight": 1.5,
						"opacity": 1
};

var clickedVectorTracksStyle = {
	"color": "#ff0000",
	"weight": 5,
	"opacity": 1
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
				selectTrack((_targetDate) ? _targetDate : null);		// Get latest track by default
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

	if (!_alternativeSource) {
		if (!pickerDate) {
			targetAvailableDay = _availableTracks[_availableTracks.length - 1];
		}
		else {
			targetAvailableDay = pickerToTrack(pickerDate);
		}
		_targetDate = targetAvailableDay;
		_selectedDayFilenames = getFilenamesForTargetDate(targetAvailableDay);
	}
	// Alternative data source: source=xxx was set in the querystring
	else {
		_selectedDayFilenames = getFilenamesForTargetDate(_alternativeSource);
	}

	_tracksGeojson = null;
	showHideVectorTracks(false);
    if (!_targetYear)
        setupVectorTracks();			// Daily view of geojson tracks
    else
        setupYearlyMbTiles();			// Yearly view of Mbtiles
	setupTracksMetadata();	
}

/**
 * setupVectorTracks
 * @param {any} silent
 */
function setupVectorTracks(silent = false) {
	var baseUrl = (_alternativeSource) ? `${GcpStorageBucketAlternativeSourceEndpoint}/${_alternativeSource}/` : NetcoupeTracksDataUrl;

    var zipVectorTracksUrl = baseUrl + _selectedDayFilenames.ZipGeojsonTracksFileName;
	if (!silent) {
		_map.spin(true);
	} 
	JSZipUtils.getBinaryContent(zipVectorTracksUrl, function(err, data) {
		if(err) {
			toastr["error"]("Could not load ZIP Vector Tracks: " + zipVectorTracksUrl);
			console.log(err);
			_map.spin(false);
		}
		JSZip.loadAsync(data).then(function (zip) {
			//zip.file(_selectedDayFilenames.VectorGeojsonTracksFileName).async("string")
			zip.file(Object.values(zip.files)[0].name).async("string")
			.then(function (data) {
				if (typeof (data) !== 'object') {
					data = JSON.parse(data);
				}
				_tracksGeojson = data;
				configureVectorTracks(silent);
				enableTrackSelection();
				setupTakeoffAirportSelecttion();
			})
			.finally(function() {
				_map.spin(false);
				if (!_tracksGeojson) {
					console.log(errorThrown);
					toastr["error"]("Could not load zip Vector Tracks: " + zipVectorTracksUrl);
				}
			});
		});
	});
}

var trackColorIndex = 0;
function configureVectorTracks(silent = false) {
    _palette = palette(_selectedPalette, _selectedPaletteCount);

	_layerVectorTracks = L.geoJSON(_tracksGeojson, {
		style: setTrackStyleFunction,
		onEachFeature: onEachFeature,			// Configure action when a track is clicked
		filter: filterByTakeOffLocation
	});
	if (!silent) {
		_layerVectorTracks.addTo(_map);
	} 
}

setTrackStyleFunction = function (feature) {
	trackColorIndex++;
	vectorTracksStyle.color = "#" + _palette[trackColorIndex % _palette.length];
	return vectorTracksStyle;
}

var _clickedFeatureOldStyle = null;
var _clickedLayer = null;
/**
 * onEachFeature
 * Change track style on click. Restore style of previously clicked track
 * @param {any} feature
 * @param {any} layer
 */
function onEachFeature(feature, layer) {
	//bind click
	layer.on('click', function (e) {
		if (_clickedFeatureOldStyle && _clickedLayer) {
			_clickedLayer.setStyle(_clickedFeatureOldStyle);
		}
		_clickedLayer = this;
		_clickedFeatureOldStyle = Object.assign({}, vectorTracksStyle);
		_clickedFeatureOldStyle.color = this.options.color;

		this.setStyle(clickedVectorTracksStyle);
	});

}


function updateVectorTracksStyle(color, opacity) {
	// Solid color
	if (color && opacity) {
		vectorTracksStyle.color = color;
		vectorTracksStyle.opacity = opacity;
		_layerVectorTracks.setStyle(vectorTracksStyle);
	}
	// Palette
	else {
		trackColorIndex = 0;
		_palette = palette(_selectedPalette, _selectedPaletteCount);
		_layerVectorTracks.setStyle(setTrackStyleFunction);
	}
	
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
