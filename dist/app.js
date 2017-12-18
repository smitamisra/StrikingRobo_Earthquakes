(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");

var g = Setup.g,
	createAppendTooltip = Setup.createAppendTooltip;
	

function createCircles(jsonData, dataConfig, projection) {

    var circleContainers = g.selectAll('circle')
        .data(jsonData);

    circleContainers.enter().append('g')
        .attr('class', 'circle');

    circleContainers.selectAll('circle')
        .data(function (d) { return d; })
        .enter().append('circle')
        .attr({
          cx: function(d) { 
              if (d.lng && d.lat) { return projection([d.lng, d.lat])[0]; }
              else { return projection(['0.0', '0.0'])[0]; }
          },
          cy: function(d) {
              if (d.lng == 'NaN'|| d.lat == 'NaN') { console.log(d); }
              if (d.lng && d.lat) { return projection([d.lng, d.lat])[1]; }
              else { return projection(['0.0', '0.0'])[1]; }
          },
          r: function(d) { 
              if (!d.lng && !d.lat && dataConfig[d.type].configData.color == 'green') { console.log('lat', d.lat, 'lng', d.lng); }
              return (d.lng && d.lat) ? '2': '0'; 
          },
          'class': function(d) { 
              var year;
              return dataConfig[d.type].className + ' ' + d.t; }
        })
        .style({
            'fill': function(d) { return dataConfig[d.type].color; },
            'opacity': 0.6
        })
        .attr("data-legend", function(d) { return d.type; })
        .on('mouseover', function(d) {
            if (d.type == 'earthquakes') { createAppendTooltip(d); }
            else if (d.type == 'tsunamis') { createAppendTooltip(d); }
            else if (d.type == 'eruptions') { createAppendTooltip(d); }

        })
        .on('mouseout', function(d) {
            if (d.type == 'earthquakes') { 
              $( '#stats-earthquakes-dynamic ul' ).remove(); 
            } else if (d.type == 'tsunamis') { 
              $( '#stats-tsunamis-dynamic ul' ).remove(); 
            } else if (d.type == 'eruptions') { 
              $( '#stats-eruptions-dynamic ul' ).remove(); 
            }
        });
    
}


module.exports = {
  createCircles
};
},{"./setup.js":6}],2:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");


function drawCountriesPath(countriesJson, path) {
	// Draw each province as a path

    var countryTooltip = d3.select("body").append("div")   
        .attr("class", "tooltip")
        .style("opacity", 0);

    Setup.g.selectAll('path')
        .data(countriesJson.features)
        .enter().append('path')
            .attr({
                'd': path,
                'id': function(d) {return d.properties.name;},
                'class': function(d) { return ['continent', d.properties.continent]; }
            })
            .attr("data-legend", function(d) { return d.properties.continent; })
            .style({
                'fill': '#666',
                'stroke-opacity': 0.4,
                'stroke': '#D3D3D3'
            })
            .on('mouseover', function(d) {
                d3.select( this )
                    .transition()
                    .style({
                        'stroke-opacity': 1,
                        'stroke': '#f00',
                        'fill': 'pink'
                    });

                $( '#continent-country h2' ).text( d.properties.name ) ;
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .style({
                        'stroke-opacity': 0.4,
                        'stroke': '#D3D3D3',
                        'fill': '#666'
                    });

                $('#stats-country-dynamic').text( ' ' );
            });
}


module.exports = {
    drawCountriesPath
};
},{"./setup.js":6}],3:[function(require,module,exports){
"use strict";


function runEvents() {
	$(".filter_button").prop('checked', true);

	$('.data-stat').mouseover(function() { console.log(this); });
}

module.exports = {runEvents};
},{}],4:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");

var createLegend = function(data) {
    var colorHash = {
        0: ['earthquakes', 'green'],
        1: ['eruptions', 'red'],
        2: ['tsunamis', 'blue']
    };

    var legend = Setup.svg.append("g")
        .attr("class", "legend")        
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(-875,15)');

    legend.selectAll('div')
        .data(data).enter();

    legend.selectAll('rect')
        .data(data).enter()
        .append("rect")
        .attr("x", Setup.width - 65)
        .attr("y", function(d, i){ return i *  20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) { 
            	var color = colorHash[data.indexOf(d)][1];
            	return color;
        })
        .on('click', function(d) {
        		var color = colorHash[data.indexOf(d)][1];
                   console.log(color);
        	   	$( 'circle.' + color).toggle();
        });

    legend.selectAll('text')
        .data(data).enter()
        .append("text")
        .attr("x", Setup.width - 52)
        .attr("y", function(d, i){ return i *  20 + 9; })
        .text(function(d) {
            var text = colorHash[data.indexOf(d)][0];
            return text;
        });
};

module.exports = {
    createLegend
};
},{"./setup.js":6}],5:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js"),
    countries = require("./countries.js"),
    circles = require("./circles.js"),
    timeLapse = require("./time_lapse.js"),
    events = require("./events.js"),
    zoom = require("./zoom.js"),
    legend = require("./legend.js");

var g = Setup.g,
	createAppendTooltip = Setup.createAppendTooltip,
	svg = Setup.svg,
	createProjection = Setup.createProjection;

var promisesArray = [
    Setup.importData('d3_jsons/times.json'), 
    Setup.importData('custom.geo.json'), 
    Setup.importData('d3_jsons/combined_points.json')    
];

Promise.all(promisesArray).then(
    results => {
        events.runEvents();

        zoom.zoom();

        var timeJson = results[0], 
            countriesJson = results[1],
            combined_points = results[2];
            // eruptionsJson = results[3],
            // earthquakesJson = results[4];

        var newProjection = createProjection(countriesJson),
            projection = newProjection[0],
            path = newProjection[1];

        countries.drawCountriesPath(countriesJson, path);

        var dataConfig = {
            tsunamis: { name: 'tsunamis', color: 'blue', circlePath: '.blue.dot', className: 'blue dot' }, 
            eruptions: { name: 'eruptions', color: 'red', circlePath: '.red.dot', className: 'red dot' },
            earthquakes: { name: 'earthquakes', color: 'green', circlePath: '.green.dot', className: 'green dot' }
        };

        circles.createCircles(combined_points, dataConfig, projection);

        timeLapse.createTimeLapse(timeJson);

        legend.createLegend(combined_points);

        $('.data-stat').mouseover(function() { console.log(this); });

    }, 
    reason => { console.log('reason', reason ); }
);
},{"./circles.js":1,"./countries.js":2,"./events.js":3,"./legend.js":4,"./setup.js":6,"./time_lapse.js":7,"./zoom.js":8}],6:[function(require,module,exports){
"use strict";

console.log(d3);

var width = 950,
    height = 400;

var svg = d3.select('#map').append('svg').attr({ width: 750, height: height });

var g = svg.append('g');

// Create a unit projection.
var createProjection = function(json) {
	var projection = d3.geo.mercator()
	    .scale(1)
	    .translate([0, 0]);

	// Create a path generator.
	var path = d3.geo.path()
	    .projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	var b = path.bounds(json),
	    s = 1.9 / Math.max((b[1][0] - b[0][0]) / width, ((b[1][1] - b[0][1]) / height) * 1.8),
	    t = [(width - s * (b[1][0] + b[0][0])) * 0.8 / 2, (height - s * (b[1][1] + b[0][1])) / 2];        

	// Update the projection to use computed scale & translate.
	projection.scale(s).translate(t);

         return [projection, path];
};

var importData = function(filePath) {
    return new Promise((resolve, reject) => {
         d3.json(filePath, function(error, json) {
            if (json) { resolve(json); }
            reject(error);
        });
    });
};

var tsunamisStats = function(d, id) {
    return `<div class='row data-stat' id='stat-${id}'>
            <ul style='background-color: lightblue;'>
                <li>Date: ${d.Month} / ${d.Day} / ${d.Year}</li>
                <li>Magnitude: ${d.Magnitude ? d.Magnitude : 'Unknown'}</li>
                <li>Focal Depth: ${d.Focal_Depth ? d.Focal_Depth : 'Unknown'}</li>
                <li>Max Water Height: ${d.Max_Water_Height ? d.Max_Water_Height : 'Unknown'}</li>
                <li>Total Deaths: ${d.Total_Deaths ? d.Total_Deaths : 'Unknown'}</li>
            </ul></div>`;
};

var earthquakesStats = function(d, id) {
    return `<div class='row data-stat' id='stat-${id}'>
            <ul style='background-color: lightgreen;'>
                <li>Date: ${d.Month} / ${d.Day} / ${d.Year}</li>
                <li>Depth (km): ${d.Depth_km ? d.Depth_km : 'Unknown'}</li>
                <li>Magnitude: ${d.Mag ? d.Mag : 'Unknown'}</li>
                <li>Max Deaths: ${d.Max_Deaths ? d.Max_Deaths : 'Unknown'}</li>
                <li>Country: ${d.Country ? d.Country : 'Unknown'}</li>
            </ul></div>`;
};

var eruptionsStats = function(d, id) {
    return `<div class='row data-stat' id='stat-${id}'>
            <ul style='background-color: pink;'>
                <li>Date: ${d.Month} / ${d.Day} / ${d.Year}</li>
                <li>Explosivity Index Max: ${d.ExplosivityIndexMax ? d.ExplosivityIndexMax : 'Unknown'}</li>
                <li>Continuing: ${d.Continuing ? d.Continuing : 'Unknown'}</li>
            </ul></div>`;
};

var createAppendTooltip = function(d) {
    var $earthquakeStats = `<ul><li><strong>Time of event: ${d.day}/${d.month}/${d.year}</strong></li></ul>`;
    var idName = '#stats-' + d.type + '-dynamic';

    $( idName ).append( $earthquakeStats );
};

module.exports = {
    width,
    height,
    svg,
    g,
    createProjection,
    importData,
    tsunamisStats,
    earthquakesStats,
    eruptionsStats,
    createAppendTooltip
};

},{}],7:[function(require,module,exports){
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
    }       
    
    function resetTimes() {        
        stopYearInterval();
        
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
},{"./setup.js":6}],8:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");

var width = Setup.width,
  height = Setup.height,
  svg = Setup.svg,
  g = Setup.g;

var zoom = function() {
  var zoom = d3.behavior.zoom()
  // only scale up, e.g. between 1x and 50x
  .scaleExtent([1, 50])
  .on("zoom", function() {
    // the "zoom" event populates d3.event with an object that has
    // a "translate" property (a 2-element Array in the form [x, y])
    // and a numeric "scale" property

      var e = d3.event,
          // now, constrain the x and y components of the translation by the
          // dimensions of the viewport
          tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
          ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));

      // then, update the zoom behavior's internal translation, so that
      // it knows how to properly manipulate it on the next movement
      zoom.translate([tx, ty]);
      // and finally, update the <g> element's transform attribute with the
      // correct translation and scale (in reverse order)
      g.attr("transform", [
          "translate(" + [tx, ty] + ")",
          "scale(" + e.scale + ")"
      ].join(" "));
  });

  svg.call(zoom).call(zoom.event);

};

module.exports = {
  zoom
};
},{"./setup.js":6}]},{},[5]);
