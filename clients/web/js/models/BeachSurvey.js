define([
	'jquery',
	'underscore',
	'backbone',
	'models/Survey',
], function ($, _, Backbone, Survey) {

	var BeachSurveyCollection = Survey.Model.extend({
	  initialize: function( models, options ) {
	  	this.url = 'api/beach/' + options.beachID + '/recent/surveys';
	  }
	});

	return {
	  Model: Survey,
	  Collection: BeachSurveyCollection
	};

});