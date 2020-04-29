var _layerDraw = null;
var drawControl = null;
var _drawControlOptions = null;

function setupDraw() {
	//customiseDrawControlText();

	_layerDraw = new L.FeatureGroup();
	_layerDraw.addTo(_map);

	// Setup options
	_drawControlOptions = {
		draw : {
			polygon:false,
			circlemarker:false,
			circle : {
				shapeOptions: {
					color: '#bada55'
				}
			}
		},
		edit: {
			featureGroup: _layerDraw
		}
	};
}

function configureDraw() {
	// Add control to map
	drawControl = new L.Control.Draw(_drawControlOptions);
	
    // --- Event Handler ---
	_map.on(L.Draw.Event.CREATED, function (e) {
		var type = e.layerType,
			layer = e.layer;
		// -- Marker : Add 100k circle around !
		if (_isCovidFlavor && type === 'marker') {
			var lat = layer._latlng.lat;
			var lon = layer._latlng.lng;
			AddCovidCircle(lat,lon);		// Add Covid circle to map
		}
		
		_layerDraw.addLayer(layer);
	});
}

function showHideDrawingTools(show) {
	if (show) {
		_map.addControl(drawControl);
	}
	else {
		drawControl.remove();
	}
}



