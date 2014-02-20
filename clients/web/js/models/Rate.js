define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Rate = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/rate',
	  defaults: function () {
	  	var d = new Date()
	    return {
		    beachID: "",
	        rating: 0,
	        created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
	    };
	  },
	});
	var RateCollection = Backbone.Collection.extend({
	  url: '/api/rate',
	  model: Rate,
	});

	return {
	  Model: Rate,
	  Collection: RateCollection
	};

});