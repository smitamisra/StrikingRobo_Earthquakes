"use strict";

let Setup = require("./setup.js");


function getColorOpacity(valueIn, valuesIn) {
  var color = d3.scale.linear() // create a linear scale
    .domain([valuesIn[0], valuesIn[1]])  // input uses min and max values
    .range([0.3, 1]);   // output for opacity between .3 and 1 %

  return color(valueIn);  // return that number to the caller
}


function getColor(d) {
    var quake_count = d.properties.earthquake_count;
    if (quake_count !== 0) {
        return '#2ca25f';
    }
    return '#666';
}


function drawCountriesPath(countriesJson, path) {
	// Draw each province as a path

    var countries = countriesJson.features;

    var minEarthquakes = 1,
        maxEarthquakes = d3.max(countries, function(c) { return c.properties.earthquake_count; }),

        minEruptions = 1,
        maxEruptions = d3.max(countries, function(c) { return c.properties.eruption_count; }),

        minTsunamis = 1,
        maxTsunamis = d3.max(countries, function(c) { return c.properties.tsunami_count; });    

    console.log('minEarthquakes', minEarthquakes, 'maxEarthquakes', maxEarthquakes);
    console.log('minEruptions', minEruptions, 'maxEruptions', maxEruptions);
    console.log('minTsunamis', minTsunamis, 'maxTsunamis', maxTsunamis);

    var countryTooltip = d3.select("body").append("div")   
        .attr("class", "tooltip")
        .style("opacity", 0);

    Setup.g.selectAll('path')
        .data(countriesJson.features)
        .enter().append('path')
            .attr({
                'd': path,
                'id': function(d) { return d.properties.ID; },
                'class': function(d) { return 'continent ' + d.properties.continent + ' ' + d.properties.name ; }
            })
            .attr("data-legend", function(d) { return d.properties.continent; })
            .style({
                'fill': getColor,
                'opacity': 0.4,
                'stroke-opacity': 0.4,
                'stroke': '#D3D3D3'
            })
            .attr('fill-opacity', function(d) {
                var count = d.properties.earthquake_count;

                return getColorOpacity(count, [minEarthquakes, maxEarthquakes]);  // give them an opacity value based on their current value
            })
            .on('mouseover', function(d) {
                if (!Setup.timer && !Setup.country) {
                    d3.select( this )
                        .transition()
                        .style({
                            'stroke-opacity': 1,
                            'stroke': '#f00',
                            'fill': 'pink'
                        });

                    $( '#continent-country h2' ).text( d.properties.name ) ;
                    $( 'circle:not(.country-id-' + d.properties.ID + ')' ).hide();

                    $( '.country-id-' + d.properties.ID ).fadeIn(200).animate({r: 6, stroke: 1}).animate({r: 2, stroke: 1});
                }
            })
            .on('mouseout', function(d) {
                if (!Setup.timer && !Setup.country) {
                    var color = getColor(d);
                    d3.select(this)
                        .transition()
                        .style({
                            'stroke-opacity': 0.4,
                            'stroke': '#D3D3D3',
                            'fill': color
                        });

                    $('#stats-country-dynamic').text( ' ' );
                    $( 'circle' ).show();
                }                
            })
            .on('click', function(d) {
                $( '#data-stats' ).empty();

                Setup.country = !Setup.country;

                $( '.country-id-' + d.properties.ID ).each(function(ind, val) {
                    var valType = val.__data__.type;

                    if (valType === 'eruptions') { $( '#data-stats' ).prepend( Setup.eruptionsStats( this.__data__, this.id ) ); }
                    else if (valType === 'tsunamis') { $( '#data-stats' ).prepend( Setup.tsunamisStats( this.__data__, this.id ) ); }
                    else if (valType === 'earthquakes') { $( '#data-stats' ).prepend( Setup.earthquakesStats( this.__data__, this.id ) ); }
                    
                });

                $('.data-stat').on('mouseenter', function() {
                    $(this).css('border-top', '1px solid black');
                    $(this).css('border-bottom', '1px solid black');                    

                    var circleId = '#' + this.id.slice( 5, this.id.length );
                    
                    $(circleId).animate({r: 6, stroke: 1});
                });

                $('.data-stat').on('mouseout', function() {
                    $(this).css('border', 'none');

                    var circleId = '#' + this.id.slice( 5, this.id.length );
                    $(circleId).animate({r: 2, stroke: 0});
                });
            });
}


module.exports = {
    drawCountriesPath
};