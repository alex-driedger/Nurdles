define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Survey = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/survey',
	  // THE DEFAULTS FUNCTION IS REMOVED BECAUSE WITH IT, BEACHSURVEY GETS DEFAULTS CALLED ONTO IT
	  // THIS CHANGES ARE COLLECTION FROM AN ARRAY, TO AN ARRAY AND A THE DEFAULTS
	  /*defaults: function () {
	  	var d = new Date()
	    return {
		    beachID: "",
	        environment: "",
	        beachtype: "",
	        date: "", 
	        weight: "0",
	        area: "0",
	        volunteers: 0,
	        bags: 0,
	        notes: "",
	        localConcern: "",
	        peculiarItems: "",
	        injuredAnimals: "",
	        hazardousDebris: "",
	    };
	  },*/
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