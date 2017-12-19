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
              return dataConfig[d.type].className + ' ' + d.t + ' country-id-' + d.country_id; 
          },
          id: function(d) { return 'circle-' + d.id; }
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