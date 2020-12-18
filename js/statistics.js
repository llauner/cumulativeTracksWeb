var _chartData = null;

function showStatistics() {
	if (!_statWindow) {
		_statWindow =  L.control.window(map,{title:"Répartition des vols sur l'année",modal: true, maxWidth:1300, className:'stat-window'})
				.content('<div id="chartdiv"></div>')
				//.prompt({callback:function(){alert('This is called after OK click!')}})
				;

		_statWindow.on('show', function (e) {
			if (!_chartData) {		// Load data if it's not available
				loadChart();
			}
		
	});
	}
	
	_statWindow.show('topLeft');
}

function loadChart() {
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end

	// Create chart instance
	chart = am4core.create("chartdiv", am4charts.XYChart);
	_map.spin(true);
	
	var statisticsTrackUrl = IgcRestApiEndpoint + IgcRestApiTracksStatisticsUrl;
	$.ajax({
				url: statisticsTrackUrl,
				type: 'GET',
				context: document.body,
				success: function(result) {
					// Get result metadata
					setupChart(result.result);
					
				},
				complete: function(jqXHR, textStatus) {
					_map.spin(false);
				}
			});
};

function setupChart(data) {
	_chartData = data;
	chart.data = _chartData;

	// Set input format for the dates
chart.dateFormatter.inputDateFormat = "yyyy_MM_dd";

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.StepLineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.tooltipText = "{value}"
series.strokeWidth = 2;
series.minBulletDistance = 15;

// Drop-shaped tooltips
series.tooltip.background.cornerRadius = 20;
series.tooltip.background.strokeOpacity = 0;
series.tooltip.pointerOrientation = "vertical";
series.tooltip.label.minWidth = 40;
series.tooltip.label.minHeight = 40;
series.tooltip.label.textAlign = "middle";
series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.strokeWidth = 2;
bullet.circle.radius = 4;
bullet.circle.fill = am4core.color("#fff");

var bullethover = bullet.states.create("hover");
bullethover.properties.scale = 1.3;

// Make a panning cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "panXY";
chart.cursor.xAxis = dateAxis;
chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarY.parent = chart.leftAxesContainer;
chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);
chart.scrollbarX.parent = chart.bottomAxesContainer;

dateAxis.start = 0;
dateAxis.keepSelection = true;

};