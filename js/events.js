"use strict";


function runEvents() {
	$(".filter_button").prop('checked', true);

	$('.data-stat').mouseover(function() { console.log(this); });
}

module.exports = {runEvents};