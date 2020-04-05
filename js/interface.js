// ----- Event handlers -----
    // --- Show / hide airspace ---
    $('#switch-airspace').on('change',
    function () {
        var show = $('#switch-airspace').is(':checked');
        isAirspaceShown = show;
        showHideAirspace(isAirspaceShown);
    });