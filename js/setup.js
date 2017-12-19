"use strict";

console.log(d3);

var width = 950,
    height = 400,
    timer,
    country = false;

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
    timer,
    country,
    svg,
    g,
    createProjection,
    importData,
    tsunamisStats,
    earthquakesStats,
    eruptionsStats,
    createAppendTooltip
};
