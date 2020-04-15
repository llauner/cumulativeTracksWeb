var _isVectorAirspaceSelected = true;
var _isOpenaipAirspaceSelected = false;

// ----- Event handlers -----
// --- Show / hide airspace ---
$('#switch-airspace').on('change',
function () {
    var show = $('#switch-airspace').is(':checked');
    isAirspaceShown = show;
    showHideAirspace(isAirspaceShown);

    if (!show)
        $('#group-airspace-layer-selector').addClass('disabled');
    else
        $('#group-airspace-layer-selector').removeClass('disabled');
});

// --- Change airspace type ---
$('#chk-vector-airspace, #chk-openaip-airspace').on('change',
function () {
    var isVectorAirspaceSelected = $('#chk-vector-airspace').is(':checked');
    // Vector airspace selected
    if (isVectorAirspaceSelected) {
        _isVectorAirspaceSelected = true;
        _isOpenaipAirspaceSelected = false;
    }
    // OpenAip airspace selected
    else {
        _isVectorAirspaceSelected = false;
        _isOpenaipAirspaceSelected = true;
    }
    showHideAirspace(true);
});

// --- Show / hide measuring tools ---
$('#chk-show-measuring-tools').on('change',
function () {
    var show = $('#chk-show-measuring-tools').is(':checked');
    showHideMeasuringTool(show)
});
	


// ----- Easy buttons -----
function setupEasyButtons() {
    _easy = L.easyButton( 'fas fa-chart-line', function(){
        showStatistics();
    });

    _easy.addTo(_map);
}