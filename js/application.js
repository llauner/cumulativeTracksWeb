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
    setupAirspace_openAipVector();

    // // Set up the OSM layer
    // var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // 	maxZoom: 19,
    // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // });
    // OpenStreetMap_Mapnik.addTo(_map);

    var Thunderforest_Outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '45799462d9f6496aba635de79c086ea2',
        minZoom: zoomLevel,
        maxZoom: maxZoomLevel,
        subdomains: ['a', 'b', 'c']
    });
    Thunderforest_Outdoors.addTo(_map);

    _layerOpenAipTilesAirspace = new L.TileLayer("http://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.png", {
                maxZoom: maxZoomLevel+1,
                minZoom: zoomLevel,
                tms: true,
                detectRetina: true,
                subdomains: '12',
                format: 'image/png',
                transparent: true
            });

    _layerOpenAirspaceLabels = new L.TileLayer.WMS("http://{s}.tile.maps.openaip.net/geowebcache/service/wms", {
                maxZoom: maxZoomLevel+1,
                minZoom: zoomLevel,
                layers: 'openaip_approved_airspaces_labels',
                tileSize: 1024,
                detectRetina: true,
                subdomains: '12',
                format: 'image/png',
                transparent: true
            });

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