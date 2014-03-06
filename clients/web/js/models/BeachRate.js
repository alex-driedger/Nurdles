define([
	'jquery',
	'underscore',
	'backbone',
	'models/Rate',
], function ($, _, Backbone, Rate) {

	var BeachRateCollection = Rate.Model.extend({
	  initialize: function( models, options ) {
	  	this.url = 'api/beach/' + options.beachID + '/recent/rates';
	  }
	});

	return {
	  Model: Rate,
	  Collection: BeachRateCollection
	};

});