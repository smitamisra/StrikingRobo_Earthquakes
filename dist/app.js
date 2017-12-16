(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");

var g = Setup.g,
	createAppendTooltip = Setup.createAppendTooltip;
	

function createCircles(jsonData, dType, dataConfig, projection) {
    let configData = dataConfig[dType];

    console.log('dType', dType, configData);                

    var showDots = true;
    if ( dType == 'tsunamis' || dType == 'eruptions') { 
        $( configData.circlePath ).remove();
        showDots = $( '#' + configData.name + '_button' ).prop( 'checked' ); 
    }

    if (showDots) {
        g.selectAll(configData.circlePath)
            .data(jsonData.data).enter()
            .append('circle')
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
                  if (!d.lng && !d.lat && configData.color == 'green') { console.log('lat', d.lat, 'lng', d.lng); }
                  return (d.lng && d.lat) ? '2': '0'; 
              },
              'class': function(d) { 
                  var year;
                  
                  return configData.className + ' ' + d.t; }
            })
            .style({
                'fill': configData.color,
                'opacity': 0.6
            })
            .on('mouseover', function(d) {
                if (configData.name == 'earthquakes') { createAppendTooltip(d, 'earthquakes'); }
                else if (configData.name == 'tsunamis') { createAppendTooltip(d, 'tsunamis'); }
                else if (configData.name == 'eruptions') { createAppendTooltip(d, 'eruptions'); }

            })
            .on('mouseout', function(d) {
                if (configData.name == 'earthquakes') { $( '#stats-earthquakes-dynamic ul' ).remove(); }
                else if (configData.name == 'tsunamis') { $( '#stats-tsunamis-dynamic ul' ).remove(); }
                else if (configData.name == 'eruptions') { $( '#stats-eruptions-dynamic ul' ).remove(); }                            
            });
    }
}


module.exports = {
  createCircles
};
},{"./setup.js":5}],2:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js");


function drawCountriesPath(countriesJson, path) {
	// Draw each province as a path
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

                $( '#stats-country-dynamic' ).text( d.properties.name ) ;
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
},{"./setup.js":5}],3:[function(require,module,exports){
"use strict";


function runEvents() {
	$(".filter_button").prop('checked', true);
}


module.exports = {runEvents};
},{}],4:[function(require,module,exports){
"use strict";

let Setup = require("./setup.js"),
    countries = require("./countries.js"),
    circles = require("./circles.js"),
    timeLapse = require("./time_lapse.js"),
    events = require("./events.js"),
    zoom = require("./zoom.js");

var g = Setup.g,
	createAppendTooltip = Setup.createAppendTooltip,
	svg = Setup.svg,
	createProjection = Setup.createProjection;

var promisesArray = [
    Setup.importData('d3_jsons/times.json'), 
    Setup.importData('custom.geo.json'), 
    Setup.importData('d3_jsons/tsunamis.json'), 
    Setup.importData('d3_jsons/eruptions.json'), 
    Setup.importData('d3_jsons/earthquakes_original.json')
];

Promise.all(promisesArray).then(
    results => {
        events.runEvents();

        zoom.zoom();

        var timeJson = results[0], 
            countriesJson = results[1],
            tsunamisJson = results[2],
            eruptionsJson = results[3],
            earthquakesJson = results[4];

        var newProjection = createProjection(countriesJson),
            projection = newProjection[0],
            path = newProjection[1];

        countries.drawCountriesPath(countriesJson, path);

        var dataConfig = {
            tsunamis: { name: 'tsunamis', color: 'blue', circlePath: '.blue.dot', className: 'blue dot' }, 
            eruptions: { name: 'eruptions', color: 'red', circlePath: '.red.dot', className: 'red dot' },
            earthquakes: { name: 'earthquakes', color: 'green', circlePath: '.green.dot', className: 'green dot' }
        };

        var circleData = [
            [earthquakesJson, 'earthquakes'],
            [eruptionsJson, 'eruptions'],
            [tsunamisJson, 'tsunamis'],
        ];

        circleData.forEach((args) => { circles.createCircles(args[0], args[1], dataConfig, projection); });

        function hideShowCircles(event) {            
        	   var target = event.currentTarget;
        	   
            if ( target.name == 'eruptions' ) { circles.createCircles(eruptionsJson, 'eruptions', dataConfig, projection); }
            else if ( target.name == 'tsunamis' ) { circles.createCircles(tsunamisJson, 'tsunamis', dataConfig, projection); }
        }

        d3.selectAll('.filter_button').on('click', hideShowCircles);

        timeLapse.createTimeLapse(timeJson);

    }, 
    reason => { console.log('reason', reason ); }
);
},{"./circles.js":1,"./countries.js":2,"./events.js":3,"./setup.js":5,"./time_lapse.js":6,"./zoom.js":7}],5:[function(require,module,exports){
"use strict";

console.log(d3);

var width = 950,
    height = 400;

var svg = d3.select('#map').append('svg').attr({ width: 650, height: height });
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
	    s = 1.25 / Math.max((b[1][0] - b[0][0]) / width, ((b[1][1] - b[0][1]) / height) * 1.2),
	    t = [(width - s * (b[1][0] + b[0][0])) * 0.68 / 2, (height - s * (b[1][1] + b[0][1])) / 2];        

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
    
var yearStats = (year, month, day) => `<h1>${year} / ${month} / ${day}</h1>`;

var tsunamisStats = function(d) {
    return `<div class='row data-stat'>
            <ul style='background-color: lightblue;'>
                <li>Magnitude: ${d.Magnitude ? d.Magnitude : 'Unknown'}</li>
                <li>Focal Depth: ${d.Focal_Depth ? d.Focal_Depth : 'Unknown'}</li>
                <li>Max Water Height: ${d.Max_Water_Height ? d.Max_Water_Height : 'Unknown'}</li>
                <li>Total Deaths: ${d.Total_Deaths ? d.Total_Deaths : 'Unknown'}</li>
            </ul></div>`;
};

var earthquakesStats = function(d) {
    return `<div class='row data-stat'>
            <ul style='background-color: lightgreen;'>
                <li>Depth (km): ${d.Depth_km ? d.Depth_km : 'Unknown'}</li>
                <li>Magnitude: ${d.Mag ? d.Mag : 'Unknown'}</li>
                <li>Max Deaths: ${d.Max_Deaths ? d.Max_Deaths : 'Unknown'}</li>
                <li>Country: ${d.Country ? d.Country : 'Unknown'}</li>
            </ul></div>`;
};

var eruptionsStats = function(d) {
    return `<div class='row data-stat'>
            <ul style='background-color: pink;'>
                <li>Explosivity Index Max: ${d.ExplosivityIndexMax ? d.ExplosivityIndexMax : 'Unknown'}</li>
                <li>Continuing: ${d.Continuing ? d.Continuing : 'Unknown'}</li>
            </ul></div>`;
};

var createAppendTooltip = function(d, name) {
    var $earthquakeStats = `<ul><li><strong>Time of event: ${d.day}/${d.month}/${d.year}</strong></li></ul>`;
    var idName = '#stats-' + name + '-dynamic';

    $( idName ).append( $earthquakeStats );
};


module.exports = {
    width,
    height,
    svg,
    g,
    createProjection,
    importData,
    yearStats,
    tsunamisStats,
    earthquakesStats,
    eruptionsStats,
    createAppendTooltip
};

},{}],6:[function(require,module,exports){
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
},{"./setup.js":5}],7:[function(require,module,exports){
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
},{"./setup.js":5}]},{},[4]);
