window['moment-range'].extendMoment(moment);                      // Extend moment with moment-range 

const AvailableDayFormat = "YYYY_MM_DD";
const datePickerFormat = "DD-MM-YYYY";

var _datePickerDialog = null;

var dialogOptions = {
    anchor: [0, 30],
    minSize: [200, 200],
    maxSize: [800, 800],
    size: [150,60]
};


function setupDatePickerDialog() {
    setupDialogWindow();
    setupDatePicker();
}

function setupDialogWindow() {
    var contents = $("#date-picker-div").html();


    _datePickerDialog = L.control.dialog(dialogOptions)
        .setContent(contents)
        .addTo(_map);

    _datePickerDialog.open();
    _datePickerDialog.hideResize();
    _datePickerDialog.hideClose();;
}

function setupDatePicker() {
    // Start + end date
    var startDate = trackToPicker(_availableTracks[0]);
    var endDate = trackToPicker(_availableTracks[_availableTracks.length - 1]);

    var momentStart = moment(startDate, datePickerFormat);
    var momentEnd = moment(endDate, datePickerFormat);

    // Dates to disable
    var missingDays = [];

    const availableRange = moment.range(momentStart, momentEnd);

    for (let day of availableRange.by('day')) {
        d = day.format(AvailableDayFormat);
        var isDayProcessed = _availableTracks.includes(d);
        if (!isDayProcessed) {
            missingDays.push(day.format(datePickerFormat));
        }
    }

    // Create date picker
    var datePicker = $("#datepicker").datepicker({
        autoclose: true,
        format: 'dd-mm-yyyy',
        startDate: startDate,
        endDate: endDate,
    });

    $('#datepicker').datepicker('setDate', (_targetDate)?_targetDate:endDate);
    $('#datepicker').datepicker('setDatesDisabled', missingDays);

    // --- Events 
    datePicker.on('changeDate', function (e) {
        var newTrackDate = moment(e.date).format(datePickerFormat);
        console.debug(`New track day selected:${newTrackDate}`);

        _alternativeSource = null;
        _targetYear = null;
        _traceAggregatorSource = null;
       
        selectTrack(newTrackDate);
    });
}


function trackToPicker(availableTrackDay) {
    return startDate = moment(availableTrackDay, AvailableDayFormat).format(datePickerFormat);
}

function pickerToTrack(pickerDay) {
    return startDate = moment(pickerDay, datePickerFormat).format(AvailableDayFormat);
}