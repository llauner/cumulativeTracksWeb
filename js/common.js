const HeatmapRestAPIEndpoint = "https://igcheatmap.appspot.com";
const NetcoupeAirspaceDataUrl = "/airspacedata/";
const NetcoupeTracksDataUrl = "/tracks/";

const IgcRestApiEndpoint = "https://igcrestapi-dot-igcheatmap.appspot.com";
const IgcRestApi_apiKey ="?apiKey=4fdec54c-aa7e-43f9-986c-407fe52302a6"
const IgcRestApiAvailableTracksUrl = "/netcoupe/tracks" + IgcRestApi_apiKey;
const IgcRestApiTracksStatisticsUrl = "/netcoupe/tracks/statistics" + IgcRestApi_apiKey;

const GcpStorageBucketAlternativeSourceEndpoint = "https://netcoupe-igc-source.storage.googleapis.com"


// Vector Tracks

const TracksMetaDataPrefix = "-tracks-metadata.json";
const VectorGeojsonTracksPrefix = "-tracks.geojson";
const ZipGeojsonTracksPrefix = "-tracks.geojson.zip";


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



class DayFilenames {
	constructor(zipGeojsonTracksFileName, vectorGeojsonTracksFileName, tracksMetaDataFileName) {
		this.ZipGeojsonTracksFileName = zipGeojsonTracksFileName;
		this.VectorGeojsonTracksFileName = vectorGeojsonTracksFileName;
		this.TracksMetaDataFileName = tracksMetaDataFileName;
	}
	
};
/**
 * getFilenamesForTargetDate
 * Builds the filenames for a given target date
 * @param {*} target_date
 */
function getFilenamesForTargetDate(target_date) {
	if (_targetYear) {
		target_date = _targetYear;
	}

	f = new DayFilenames(`${target_date}-tracks.geojson.zip`,
		`${target_date}-tracks.geojson`,
		`${target_date}-tracks-metadata.json`)

	return f;
}