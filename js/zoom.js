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