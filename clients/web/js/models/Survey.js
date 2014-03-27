define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Survey = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/survey',
	});
	var SurveyCollection = Backbone.Collection.extend({
	  url: '/api/survey',
	  model: Survey,
	  comparator: function(e1, e2)
	  {
	  	if (e1.get('created') > e2.get('created')) return -1; // before
  		if (e1.get('created') < e2.get('created')) return 1; // before
  		return 0; // equal
	  },
	  initialize: function( models, options ) {
	  	if (options != undefined)
	  	{
	  		this.url = '/api/survey/'+options.surveyID
	  	}
	  }
	});

	return {
	  Model: Survey,
	  Collection: SurveyCollection
	};

});