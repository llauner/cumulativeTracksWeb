const HeatmapRestAPIEndpoint = "https://igcheatmap.appspot.com";
const NetcoupeAirspaceDataUrl = "/airspacedata/";
const NetcoupeTracksDataUrl = "/tracks/";

// Vector Tracks
const latestSuffix = "latest";

const TracksMetaDataPrefix = "-tracks-metadata.json";
var TracksMetaDataFileName = latestSuffix + TracksMetaDataPrefix;

const GeojsonTracksFileName = "latest-tracks.geojson";		// This does not change. Is also name inside zip archive

const VectorGeojsonTracksPrefix = "-tracks.geojson";
var VectorGeojsonTracksFileName = latestSuffix + VectorGeojsonTracksPrefix;

const ZipGeojsonTracksPrefix = "-tracks.geojson.zip";
var ZipGeojsonTracksFileName = latestSuffix + ZipGeojsonTracksPrefix;

const StatisticsTracksPrefix = "-tracks-statistics.json";
var StatisticsTracksFileName = latestSuffix + StatisticsTracksPrefix;

// OpenAIP
const OpenAipGeojsonFileName = "openaip-airspace.geojson";
const OpenAipVectorAirspaceMetadataFileName = "openaip-airspace-metadata.json";
const OpenAipAirportsFileName = "openaip-airport.geojson";

// Netcoupe OpenAir
const OpenAirGeojsonFileName = "netcoupe-france.geojson";
const OpenAirMetadataFileName = "netcoupe-france-metadata.json";

// Map

const MapMaxBounds = [
						[34.590383333333335, -9.461916666666667], 
						[58.11829999999999, 15.603066666666663]
];


/**
 * updateUrlsForTargetYear
 * Update URLs so that they point to the year related data
 * @param {*} year
 */
function updateUrlsForTargetYear(year) {
	TracksMetaDataFileName = year + TracksMetaDataPrefix;
	ZipGeojsonTracksFileName = year + ZipGeojsonTracksPrefix;
	VectorGeojsonTracksFileName = year + VectorGeojsonTracksPrefix;
	StatisticsTracksFileName = year + StatisticsTracksPrefix;
}