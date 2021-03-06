"use strict";

let Setup = require("./setup.js"),
    countries = require("./countries.js"),
    boundaries = require("./boundaries.js"),
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
    Setup.importData('d3_jsons/combined_points.json'),
    Setup.importData('MR_Data/PB2002_plates.json')
];

Promise.all(promisesArray).then(
    results => {
        events.runEvents();

        zoom.zoom();

        var timeJson = results[0], 
            countriesJson = results[1],
            combined_points = results[2],
            plates_json = results[3];

        var newProjection = createProjection(countriesJson),
            projection = newProjection[0],
            path = newProjection[1];

        // var platesProjection = createProjection(plates_json),
        //     pProjection = platesProjection[0],
        //     pPath = pProjection[1];        

        countries.drawCountriesPath(countriesJson, path);

        // boundaries.drawPlatesPath(plates_json, pPath);

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