var _isOpenAirVectorAirspaceSelected = true;
var _isOpenAipTilesAirspaceSelected = false;
var _isOpenAipVectorAirspaceSelected = false;

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
$('#chk-vector-airspace, #chk-openaip-airspace, #chk-openaip-vector-airspace').on('change',
function () {
    _isOpenAirVectorAirspaceSelected = $('#chk-vector-airspace').is(':checked');
    _isOpenAipTilesAirspaceSelected = $('#chk-openaip-airspace').is(':checked');
    _isOpenAipVectorAirspaceSelected = $('#chk-openaip-vector-airspace').is(':checked');
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