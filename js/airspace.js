var _airspaceLayer = null;
var _airspaceGeojson = null;

function setupAirspace() {
    var airspaceUrl = HeatmapRestAPIEndpoint + "/airspace/geojson";
    $.ajax({
        url: airspaceUrl,
        type: 'GET',
        context: document.body,
        dataType: "json",
        success: function(result) {
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
            _airspaceGeojson = result;  
        },
        error: function(result, status, errorThrown) {
            console.log(errorThrown);
            toastr["error"]("Could not load Airspace: " + airspaceUrl);
        }
    });
}

function configureAirspace() {
	_airspaceLayer = L.geoJSON(_airspaceGeojson,
			{style: areaStyle,
			onEachFeature: labelStyle,
			}
		).addTo(_map);
}

function showHideAirspace(visible) {
	// Create layer if needed
	if (visible && !_airspaceLayer) {
		configureAirspace();
	}
	else if (visible) {
        _airspaceLayer.addTo(_map);
	}
	 // --- Hide
    else {
        _airspaceLayer.remove();
    }
}

function getAreaColor(feature){
		switch (feature.properties.CLASS){
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
	var labelText = feature.properties.CLASS + "<br>" + 
					feature.properties.NAME + "<br>" +
					feature.properties.CEILING + "	&#92; " +
					feature.properties.FLOOR;
	layer.bindTooltip(labelText, {opacity: 0.7});
}
