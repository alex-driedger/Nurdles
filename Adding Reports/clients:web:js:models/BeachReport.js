define([
	'jquery',
	'underscore',
	'backbone',
	'models/Report',
], function ($, _, Backbone, Report) {

	var BeachReportCollection = Report.Model.extend({
	  initialize: function( models, options ) {
	  	this.url = 'api/beach/' + options.beachID + '/recent/reports';
	  }
	});

	return {
	  Model: Report,
	  Collection: BeachReportCollection
	};

});