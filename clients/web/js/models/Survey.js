define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Survey = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/survey',
	  defaults: function () {
	  	var d = new Date()
	    return {
		    beachID: "",
	        environment: "",
	        beachtype: "",
	        info1: "", 
	        info2: "",
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
	        created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
	    };
	  },
	});
	var SurveyCollection = Backbone.Collection.extend({
	  url: '/api/survey',
	  model: Survey,
	});

	return {
	  Model: Survey,
	  Collection: SurveyCollection
	};

});