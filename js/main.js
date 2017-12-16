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