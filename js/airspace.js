var _layerOpenAirVectorAirspace = null;
var _airspaceGeojson = null;

var _airspaceLabelsMinZoom = 9;

function setupAirspace() {
	// --- Get Netcoupe OpenAir airspace ---
    var metadataUrl = NetcoupeAirspaceDataUrl + OpenAirMetadataFileName;

    $.ajax({
		url: NetcoupeGeojsonAirspaceUrl,
        type: 'GET',
        context: document.body,
        dataType: "json",
        success: function(result) {
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
			_airspaceGeojson = result;
			configureAirspace();
			enableAirspaceSelection();
        },
        error: function(result, status, errorThrown) {
            console.log(errorThrown);
            toastr["error"]("Could not load Airspace: " + airspaceUrl);
        }
	});
}

function configureAirspace() {
	_layerOpenAirVectorAirspace = L.geoJSON(_airspaceGeojson,
		{style: areaStyle,
		onEachFeature: labelStyle
		}
	);
}

function showHideAirspace(visible) {
	showHideOpenAirAirspace(visible && _isOpenAirVectorAirspaceSelected);
}

function getAreaColor(feature){
		switch (feature.properties.class){
		case 'A' : return 'hsl(0, 72%, 44%)';
		case 'C' : return 'hsl(36, 76%, 63%)';
		case 'D' : return 'hsl(219, 59%, 32%)';
		case 'E' : return 'hsl(105, 73%, 37%)';
		case 'G' : return 'hsl(154, 79%, 58%)';
		case 'CTR' : return 'hsl(281, 63%, 65%)';
		case 'P' : return 'hsl(360, 89%, 32%)';
		case 'R' : return 'hsl(0, 55%, 56%)';
		case 'Q' : return 'hsl(0, 68%, 57%)';
		case 'GP' : return 'hsl(16, 66%, 44%)';
			break;
	}
};

function areaStyle(feature){
	return {
		fillColor: getAreaColor(feature),
		weight: 1,
		opacity: 1,
		color: getAreaColor(feature),
		//dashArray: '5',
		fill: false,
	}
};

function labelStyle(feature, layer) {
    var labelText = feature.properties.class +
        "<br>" +
        feature.properties.name +
        "<br>" +
		`${feature.properties.upperCeiling.value} ${feature.properties.upperCeiling.unit}` + " / " +
        `${feature.properties.lowerCeiling.value} ${feature.properties.lowerCeiling.unit}`;
    layer.bindTooltip(labelText, {opacity: 0.7});
}

function showAirspaceLabels() {
	// Labels for Open AIP Vector layer
	if (_map.hasLayer(_layerOpenAipVectorAirspace)) {
		if (_isLayerOpenAipVectorAirspaceLabelsShown && _map.getZoom() <= _airspaceLabelsMinZoom) {
			showHideOpenAipVectorAirspaceLabels(false);
		}
		else if (!_isLayerOpenAipVectorAirspaceLabelsShown && _map.getZoom() > _airspaceLabelsMinZoom) {
			showHideOpenAipVectorAirspaceLabels(true);
		}
	}
}


function showHideOpenAirAirspace(show) {
	if (show) {
		_layerOpenAirVectorAirspace.addTo(_map);
    }
	else {
		_layerOpenAirVectorAirspace.remove();
    }
}