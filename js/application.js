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

function setupMap() {
    // Create the map
    _map = L.map('map', {
        maxBoundsViscosity: 1
    }).setView(center, zoomLevel);
    var sidebar = L.control.sidebar('sidebar').addTo(_map);

    // ----- Load MetaData -----
    _map.spin(true);
    $.ajax({
                url: "/tracks/latest-tracks-metadata.json",
                type: 'GET',
                context: document.body,
                success: function(result) {
                    // Get result metadata
                    metadata = result;
                    tracksMetaData = result;
                    targetDate = moment(metadata.targetDate, "YYYY_MM_DD");
                    startDate = moment(metadata.startDate, "YYYY_MM_DD HH:mm:ss");

                    targetDateToDisplay = targetDate.format("DD/MM/YYYY");
                    startDateToDisplay = moment(startDate).format("DD/MM/YYYY HH:mm:ss");
                    duration = metadata.duration;
                    flightsCount = metadata.flightsCount;
                    processedFlightsCount = metadata.processedFlightsCount;

                    // --- Init interface ---
                    // --- Populate information panel
                    $('#target-date').html(targetDateToDisplay);
                    $('#start-date').html(startDateToDisplay);
                    $('#duration').html(duration);
                    $('#flights-count').html(flightsCount);
                    $('#processed-flights-count').html(processedFlightsCount);

                    addImageOverlay();  // Add tracks image overlay
                },
                complete: function(jqXHR, textStatus) {
                    _map.spin(false);
                }
            });

    // --- Load Airspace ---
    setupAirspace();

    function addImageOverlay() {
    // add a marker in the given location
    //L.marker(tracksMetaData.boundingBoxUpperLeft).addTo(_map); 
    //L.marker(tracksMetaData.boundingBoxLowerRight).addTo(_map);

        var imageUrl = '/tracks/latest-tracks.png',
        imageBounds = [ tracksMetaData.boundingBoxUpperLeft, tracksMetaData.boundingBoxLowerRight];
        L.imageOverlay(imageUrl, imageBounds).addTo(_map);

        // Map Bounds : add margin and set
        const boundPadding = 8;
        maxBounds = imageBounds.slice();
        maxBounds[0][0] -= boundPadding;
        maxBounds[0][1] -= boundPadding;
        maxBounds[1][0] += boundPadding;
        maxBounds[1][1] += boundPadding;

        //L.marker(maxBounds[0]).addTo(_map);
        //L.marker(maxBounds[1]).addTo(_map);

        _map.setMaxBounds(maxBounds);     // Max bounds: preventes map from panning
        // --- map Events ---
        _map.on('moveend', showAirspaceLabels);
        _map.on('zoomend', showAirspaceLabels);
    };

    // Set up the OSM layer
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

    _layerOpeneAirspace = new L.TileLayer("http://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.png", {
                maxZoom: maxZoomLevel+1,
                minZoom: zoomLevel,
                tms: true,
                detectRetina: true,
                subdomains: '12',
                format: 'image/png',
                transparent: true
            });
    //_layerOpeneAirspace.addTo(_map);

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