define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Report = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/report',
	  defaults: function () {
	  	var d = new Date()
	    return {

		    items: "",
          	description: "",
          	comments: "",
	        created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
	    };
	  },
	});
	var ReportCollection = Backbone.Collection.extend({
	  url: '/api/report',
	  model: Report,
	});

	return {
	  Model: Report,
	  Collection: ReportCollection
	};

});