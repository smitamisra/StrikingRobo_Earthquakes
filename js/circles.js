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