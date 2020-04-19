var _openAipVectorAirspaceGeojson = null;
var _openAipVectorAirspaceMetadata = null;
var _openAipVectorAirspaceMarkers = [];

var _assetLayerGroup = new L.LayerGroup();

function setupAirspace_openAipVector() {
    var airspaceUrl = NetcoupeAirspaceDataUrl + OpenAipGeojsonFileName;
    var metadataUrl = NetcoupeAirspaceDataUrl + OpenAipVectorAirspaceMetadataFileName

    // -- Get openaip-airspace.geojson ---
    $.ajax({
        url: airspaceUrl,
        type: 'GET',
        context: document.body,
        dataType: "json",
        success: function(result) {
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
            _openAipVectorAirspaceGeojson = result;
            configureAirspace_openAipVector();  
        },
        error: function(result, status, errorThrown) {
            console.log(errorThrown);
            toastr["error"]("Could not load Airspace: " + airspaceUrl);
        }
    });

    // --- Get metadata ---
    $.ajax({
        url: metadataUrl,
        type: 'GET',
        context: document.body,
        dataType: "json",
        success: function(result) {
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
            _openAipVectorAirspaceMetadata = result;
            initToolTip_OpenAipVector(_openAipVectorAirspaceMetadata);
        },
        error: function(result, status, errorThrown) {
            console.log(errorThrown);
            toastr["error"]("Could not load Airspace metadata: " + metadataUrl);
        }
    });
}

function showHideOpenAipVectorAirspace(show) {
    if (show) {
        _layerOpenAipVectorAirspace.addTo(_map);
		showHideOpenAipVectorAirspaceLabels(true);
    }
    else {
        showHideOpenAipVectorAirspaceLabels(false);
		_layerOpenAipVectorAirspace.remove();
    }
}

function showHideOpenAipVectorAirspaceLabels(show) {
    if (show && _map.getZoom() > _airspaceLabelsMinZoom) {
        _layerOpenAipVectorAirspaceLabels = L.canvasIconLayer({}).addTo(_map);
        _layerOpenAipVectorAirspaceLabels.addMarkers(_openAipVectorAirspaceMarkers);
        _isLayerOpenAipVectorAirspaceLabelsShown = true;
    }
    else if (!show && _layerOpenAipVectorAirspaceLabels) {
        for (i=0; i<_openAipVectorAirspaceMarkers.length; i++) {
            _layerOpenAipVectorAirspaceLabels.removeMarker(_openAipVectorAirspaceMarkers[i]);
        }
        _layerOpenAipVectorAirspaceLabels.redraw();
        _isLayerOpenAipVectorAirspaceLabelsShown = false;
    }
}

function configureAirspace_openAipVector() {
	_layerOpenAipVectorAirspace = L.geoJSON(_openAipVectorAirspaceGeojson,
			{style: areaStyle_openAipVector,
			onEachFeature: labelStyle_openAipVector,
			}
        );
}

function areaStyle_openAipVector(feature){
	return {
		fillColor: getAreaColor(feature),
		weight: 2,
		opacity: 1,
		color: getAreaColor_openAipVector(feature),
		//dashArray: '5',
		fill: false,
	}
};

function labelStyle_openAipVector(feature, layer) {
    var labelText = feature.properties.category + " - " + feature.properties.name;
    var img = 'data:image/svg+xml,' + encodeURIComponent(svgText(labelText, feature));
    var icon = L.icon({
        iconUrl: img,
        iconSize: [300, 30],
        iconAnchor: [0, 30]
    });
    var centroid = getCentroid(feature.geometry.coordinates[0]);
    var popupText = feature.properties.category + "<br>" +
                    feature.properties.name + "<hr>" +
                    feature.properties.alt_limits.top.value + "<br>------<br>" +
                    feature.properties.alt_limits.bottom.value;
    var marker = L.marker([centroid[1], centroid[0]], {icon: icon}).bindPopup(popupText);
    _openAipVectorAirspaceMarkers.push(marker);
    


	// var labelText = feature.properties.CLASS + "<br>" + 
	// 				feature.properties.NAME + "<br>" +
	// 				feature.properties.CEILING + "	&#92; " +
	// 				feature.properties.FLOOR;
	// layer.bindTooltip(labelText, {opacity: 0.7});
}

function getAreaColor_openAipVector(feature){
	switch (feature.properties.category){
	case 'A' : return 'hsl(0, 72%, 44%)';
	case 'C' : return 'hsl(36, 76%, 63%)';
	case 'D' : return 'hsl(219, 59%, 32%)';
	case 'E' : return 'hsl(105, 73%, 37%)';
	case 'GLIDING' : return 'hsl(154, 79%, 58%)';
	case 'CTR' : return 'hsl(281, 63%, 65%)';
	case 'PROHIBITED' : return 'hsl(360, 89%, 32%)';
	case 'RESTRICTED' : return 'hsl(0, 55%, 56%)';
	case 'GP' : return 'hsl(16, 66%, 44%)';
		break;
}
};

function svgText(txt, feature) {
    var color = getAreaColor_openAipVector(feature);
    var test = `${color}`;
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="30"><text x="0" y="30" style="font-size: 14px;" fill="${color}"\>${txt}</text></svg>`;  
     return svg;    
  }

  var getCentroid = function (arr) { 
    return arr.reduce(function (x,y) {
        return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length] 
    }, [0,0]) 
}