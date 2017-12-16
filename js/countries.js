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