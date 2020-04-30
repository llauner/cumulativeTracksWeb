
// Tracks layer
var _isVectorTracksLayerSelected = true;
// Airspace layer
var _isOpenAirVectorAirspaceSelected = true;
var _isOpenAipTilesAirspaceSelected = false;
var _isOpenAipVectorAirspaceSelected = false;

// ----- Event handlers -----
// --- Show / hide Tracks
$('#chk-vector-tracks').on('change',
function () {
    _isVectorTracksLayerSelected = $('#chk-vector-tracks').is(':checked');

    showHideVectorTracks(_isVectorTracksLayerSelected);
});

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

// --- Show / hide airports ---
$('#chk-airports').on('change',
function () {
    var show = $('#chk-airports').is(':checked');
    showHideAirports(show);
});

// --- Show / hide measuring tools ---
$('#chk-show-measuring-tools').on('change',
function () {
    var show = $('#chk-show-measuring-tools').is(':checked');
    showHideMeasuringTool(show);
});

// --- Show / hide drawing tools ---
$('#chk-show-drawing-tools').on('change',
function () {
    var show = $('#chk-show-drawing-tools').is(':checked');
    showHideDrawingTools(show);
});

// --- Scroll Wheel Zoom
$('#chk-scroll-wheel-zoom').on('change',
function () {
    var checked = $('#chk-scroll-wheel-zoom').is(':checked');
    updateMapOptions(checked);
});


// ----- Easy buttons -----
function setupEasyButtons() {
    _easyButton = L.easyButton( 'fas fa-chart-line', function(){
        showStatistics();
    });

    _easyButton.addTo(_map);
}

// --- Enable / Disable UI elements ---
/**
 * enableDisableTrackSelection
 * Disable the track selection until the Vector tracks have been loaded
 * @param {*} enable
 */
function enableDisableTrackSelection(enable) {

}

// --- Init tooltips ---
function initToolTip_OpenAipVector(metadata) {
    var text = `Source: OpenAip<br>Date: ${metadata.date}<br>Airspace Count: ${metadata.airspaceCount}`;
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'auto',
        html: true,
        title: text
    })
}

function initToolTip_OpenAir(metadata) {
    var text = `Source: ${metadata.source}<br>Date:${metadata.date}`;
    $('[data-toggle="tooltip-openair"]').tooltip({
        placement: 'auto',
        html: true,
        title: text
    })
}

function initToolTip_OpenAipTiles() {
    var text = `Source: OpenAip<br>Date: latest...`;
    $('[data-toggle="tooltip-openaip-tiles"]').tooltip({
        placement: 'auto',
        html: true,
        title: text
    })
}

function initInterface() {
    initToolTip_OpenAipTiles();
}

// ---  Color Picker ---
$('#color-picker').colorpicker({
    color: vectorTracksStyle.color,
    format: "hexa",
    useAlpha: true
});

$('#color-picker').on('colorpickerChange', function(event) {
    //$('#color-pciker').css('background-color', event.color.toString());
    var color = event.color.toHexString();
    var alpha = event.color._color.valpha;
    updateVectorTracksStyle(color, alpha);
    });