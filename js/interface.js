
// Tracks layer
var _isVectorTracksLayerSelected = true;
// Airspace layer
var _isOpenAirVectorAirspaceSelected = true;

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
function enableTrackSelection() {
    $('#switch-tracks-container').removeClass("disabled");
}

function enableAirspaceSelection() {
    $('#switch-airspace-container').removeClass("disabled");
}

function enableAirportsSelection() {
    $('#switch-airports-container').removeClass("disabled");
}

function enableAirportFilterSelection() {
    $('#select-airfield').removeClass("disabled");
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

// --- Palette dropdown ---
$(".dropdown li a").on("click", function (event) {
    console.log("You clicked the drop downs", event)
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));

    _selectedPalette = $(this).data('value');
    _selectedPaletteCount=parseInt($(this).data('count'));
    updateVectorTracksStyle(null, null);
});

// --- Links ---
$('a[href="#tracks2020"]').click(function () {
    location.replace('/?year=2020');
}); 

$('a[href="#tracks2021"]').click(function () {
    location.replace('/?year=2021');
});

$('a[href="#tracks2022"]').click(function () {
    location.replace('/?year=2022');
});
$('a[href="#tracks2023"]').click(function () {
    location.replace('/?year=2023');
});
$('a[href="#tracks2024"]').click(function () {
    location.replace('/?year=2024');
});
$('a[href="#help"]').click(function () {
    location.replace('/help.htm');
});

// --- Filters ---
$('#select-airfield').on('change',
    function () {
        var selectedAirfield = $("#select-airfield").val();
        targetAirfieldIndex = -1;

        // Target airfield specified as query string parameter
        if (_targetAirfield != null) {
            targetAirfieldIndex = getAirportIndex(_targetAirfield);
            selectedAirfield = (targetAirfieldIndex > -1) ? targetAirfieldIndex + 1 : selectedAirfield;

            $("#select-airfield").val(selectedAirfield);
            _targetAirfield = null;

            if (targetAirfieldIndex == -1) {
                toastr["error"]("Target Airfield does not exist / not available for the current day: " + _targetAirfield);
                console.log(err);
            }
        }
        _currentAirportFilterValue = (selectedAirfield == 0) ? null : selectedAirfield;

        console.log(`Filter on takeoff airfield: ${selectedAirfield} - ${_selectableAirportsName[_currentAirportFilterValue - 1]}`)
 
        showHideVectorTracks(false);
        configureVectorTracks(true);
        showHideVectorTracks(true);

        // ----- MbTiles -----
        if (_mapboxPbfLayer)
            _mapboxPbfLayer.redraw();
    });