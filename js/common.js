const HeatmapRestAPIEndpoint = "https://igcheatmap.appspot.com";
const IgcRestApiEndpoint = "https://igcrestapi-dot-igcheatmap.appspot.com";

const IgcRestApiAvailableTracksUrl = "/netcoupe/tracks";
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



class DayFilenames {
	constructor(zipGeojsonTracksFileName, vectorGeojsonTracksFileName, tracksMetaDataFileName, statisticsTracksFileName) {
		this.ZipGeojsonTracksFileName = zipGeojsonTracksFileName;
		this.VectorGeojsonTracksFileName = vectorGeojsonTracksFileName;
		this.TracksMetaDataFileName = tracksMetaDataFileName;
		this.StatisticsTracksFileName = statisticsTracksFileName;
    }
	
};
/**
 * getFilenamesForTargetDate
 * Builds the filenames for a given target date
 * @param {*} target_date
 */
function getFilenamesForTargetDate(target_date) {
	filenames = {};
	filenames.ZipGeojsonTracksFileName = `${target_date}-tracks.geojson.zip`;
	filenames.VectorGeojsonTracksFileName = `${target_date}-tracks.geojson`;
	filenames.TracksMetaDataFileName = `${target_date}-tracks-metadata.json`;
	filenames.StatisticsTracksFileName = `${target_date}-tracks-statistics.json`;

	f = new DayFilenames(`${target_date}-tracks.geojson.zip`,
		`${target_date}-tracks.geojson`,
		`${target_date}-tracks-metadata.json`,
		`${target_date}-tracks-statistics.json`)

	return f;
}