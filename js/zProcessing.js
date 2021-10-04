var _airportsName = null;
var _selectableAirportsName = [];

(async () => {
    console.log("Waiting for data to be loaded: Airports + Tracks");
    while (_airportsGeojson == null || _tracksGeojson == null) // define the condition as you like
        await new Promise(resolve => setTimeout(resolve, 1000));
    // Airports list is loaded
    console.log("Data loaded: Airports + Tracks");
    collectAirportsName();
    startPostProcessing();
})();


/**
 * collectAirportsName
 * Collect airports name from the list
 * */
function collectAirportsName() {
    _airportsName = [];
    _airportsGeojson.features.forEach(a => {
        _airportsName.push(extractAirportName(a));
    });
}

function extractAirportName(feature) {
    return `${feature.properties.name} - ${feature.properties.icao}`;
}


/**
 * assignAirportToTrack
 * */
function startPostProcessing() {
    _tracksGeojson.features.forEach(t => {
        var trackStartingPoint = t.geometry.coordinates[0];
        var takeoffAirportName = null;

        // Look for airports near the takeoff location
        _airportsGeojson.features.every(a => {
            var airportCenter = a.geometry.coordinates;
            var airportName = extractAirportName(a);

            var IsTrackStartingAtAirport = ptInCircle(trackStartingPoint, airportCenter, 1000);

            if (IsTrackStartingAtAirport) {
                takeoffAirportName = airportName
                //console.log(`Airport found: ${takeoffAirportName}`)

                if (!_selectableAirportsName.includes(takeoffAirportName))
                    _selectableAirportsName.push(takeoffAirportName);
                return false;
            }
            return true;
        });

        if (takeoffAirportName != null) {
            t.properties.takeoffLocation = takeoffAirportName;
        }
    });

    // Sort list of airfields
    _selectableAirportsName.sort();
    // Populate select box
    _selectableAirportsName.forEach( (a, i) => {
        $("#select-airfield").append(`<option value=${i}>${a}</option>`);
    });
    
}

function filterByTakeOffLocation(feature) {
    if (_currentAirportFilterValue == null)
        return true;

    var currentAirportFilterName = _selectableAirportsName[_currentAirportFilterValue];
    if (feature.properties.takeoffLocation == currentAirportFilterName)
        return true;
}



/**
 * @description Check if a pt is in, on or outside of a circle.
 * @param {[float]} pt The point to test. An array of two floats - x and y coordinates.
 * @param {[float]} center The circle center. An array of two floats - x and y coordinates.
 * @param {float} r The circle radius.
 * @returns {-1 | 0 | 1} -1 if the point is inside, 0 if it is on and 1 if it is outside the circle.
 */
function ptInCircle(pt, center, r) {
    var d = haversine(pt[1], pt[0], center[1], center[0]);
    return (d <= r) ? true : false;
}


Number.prototype.toRad = function () //to rad function which is used by the haversine formula
{
    return this * Math.PI / 180;
}

function haversine(lat1, lng1, lat2, lng2) {  //haversine foruma which is used to calculate the distance between 2 coordinates

    var lon1 = lng1;
    var lon2 = lng2;
    var R = 6371000; // metres
    var a = lat1.toRad();
    var b = lat2.toRad();
    var c = (lat2 - lat1).toRad();
    var d = (lon2 - lon1).toRad();

    var a = Math.sin(c / 2) * Math.sin(c / 2) +
        Math.cos(a) * Math.cos(b) *
        Math.sin(d / 2) * Math.sin(d / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
}