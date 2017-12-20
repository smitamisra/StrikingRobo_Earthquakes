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