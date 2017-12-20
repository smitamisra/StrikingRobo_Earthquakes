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
            Setup.timer = true;

            $('.' + currentTime).each(function() {
                $( this ).show();

                $( this ).fadeIn(200).animate({r: 6, stroke: 1}).animate({r: 2, stroke: 1});

                var current_year = $('#stats-year').html();
                if (current_year != this.__data__.Year && current_year < this.__data__.Year) {
                    $('#stats-year').html(this.__data__.Year);
                }                
                if (this.classList.contains("red")) { $( '#data-stats' ).prepend( Setup.eruptionsStats( this.__data__, this.classList[2] ) ); }
                else if (this.classList.contains("blue")) { $( '#data-stats' ).prepend( Setup.tsunamisStats( this.__data__, this.classList[2] ) ); }
                else if (this.classList.contains("green")) { $( '#data-stats' ).prepend( Setup.earthquakesStats( this.__data__, this.classList[2] ) ); }
            });
            currentTime++;            
        }, 25);
    }
    
    function stopYearInterval() {         
        var interval = yearInterval; 
        clearInterval(interval); 

        Setup.timer = false;
    }       
    
    function resetTimes() {        
        stopYearInterval();

        Setup.timer = false;
        
        $('circle').show();
        $('#stats-year').empty();
        $('#data-stats').empty();
        
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