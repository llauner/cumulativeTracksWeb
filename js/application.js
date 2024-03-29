toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

// Leaflet Map options : https://leafletjs.com/reference-1.6.0.html#map-option
var _mapOptions = {
    //maxBounds: L.latLngBounds(MapMaxBounds[0], MapMaxBounds[1]),
    //maxBoundsViscosity: 1,
    scrollWheelZoom: true
}

function setupMap() {
    // Create the map
    _map = L.map('map', _mapOptions).setView(center, zoomLevel);
    var sidebar = L.control.sidebar('sidebar').addTo(_map);

    // --- Load Airspace ---
    setupAirspace();

    // // Set up the OSM layer
    // var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // 	maxZoom: 19,
    // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // });
    // OpenStreetMap_Mapnik.addTo(_map);

    var baseMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    baseMapLayer.addTo(_map);

    // Add scale
    L.control.scale ({maxWidth:240, metric:true, imperial:false, position: 'bottomleft'}).addTo(_map);
}

function updateMapOptions(scrollWheelZoom) {
    setMapOption('scrollWheelZoom', scrollWheelZoom);
}

function setMapOption( newMapOptionKey, newMapOptionVal ){
    // set map option
    L.Util.setOptions( _map, {[newMapOptionKey]: newMapOptionVal});
    // apply option to handler
    if ( _map[newMapOptionKey] instanceof L.Handler ) {
        if ( newMapOptionVal ) {
            _map[newMapOptionKey].enable();
        } else {
            _map[newMapOptionKey].disable();
        }
    }
}