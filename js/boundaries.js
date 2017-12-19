"use strict";

let Setup = require("./setup.js");


function drawPlatesPath(platesJson, path) {
    // Draw each province as a path
    console.log(platesJson);

    var plates = platesJson.features;    

    Setup.g.selectAll('path')
        .data(plates)
        .enter().append('path')
            .attr({
                'd': path,                
                'class': 'boundary'
            })
            .attr("data-legend", function(d) { return d.properties.PlateName; })
            .style({
                'fill': 'pink',
                'opacity': 0.4                
            });            
}


module.exports = {
    drawPlatesPath
};