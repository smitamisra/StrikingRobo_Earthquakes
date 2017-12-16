"use strict";

let Setup = require("./setup.js");

function createTimeLapse(timeJson) {
	
    var minTime = d3.min(timeJson), 
        maxTime = d3.max(timeJson),
        currentTime = minTime,
        yearInterval;    
    
    function startInterval() {
        if (currentTime == 0) { $('circle').hide(); }
        
        yearInterval = setInterval(function() {
            $('.' + currentTime).each(function() {
                $( this ).show();

                $( this ).fadeIn(200).animate({r: 6, stroke: 1}).animate({r: 2, stroke: 1});

                $('#row-title').html( Setup.yearStats(this.__data__.Year, this.__data__.Month, this.__data__.Day) );
                if (this.classList.contains("red")) { $( '#data-stats' ).prepend( Setup.eruptionsStats( this.__data__ ) ); }
                else if (this.classList.contains("blue")) { $( '#data-stats' ).prepend( Setup.tsunamisStats( this.__data__ ) ); }
                else if (this.classList.contains("green")) { $( '#data-stats' ).prepend( Setup.earthquakesStats( this.__data__ ) ); }
            });
            currentTime++;            
        }, 25);
    }
    
    function stopYearInterval() {         
        var interval = yearInterval; 
        clearInterval(interval); 
    }       
    
    function resetTimes() {        
        stopYearInterval();
        
        $('circle').show();
        $('#row-title').empty();
        
        minTime = d3.min(timeJson);
        maxTime = d3.max(timeJson);
        currentTime = minTime;
    }
    
    $('#time-lapse-start').on('click', startInterval);
    $('#time-lapse-stop').on('click', stopYearInterval);
    $('#time-lapse-reset').on('click', resetTimes);
}


module.exports = {
    createTimeLapse
};