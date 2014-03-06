define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Report = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/report',
	  /*defaults: function () {
	  	var d = new Date()
	    return {

		    items: "",
          	beachID: "",
          	comments: "",
	    };
	  },*/
	});
	var ReportCollection = Backbone.Collection.extend({
	  url: '/api/report/',
	  model: Report,
	  comparator: function(e1, e2)
	  {
	  	if (e1.get('created') > e2.get('created')) return -1; 
  		if (e1.get('created') < e2.get('created')) return 1; 
  		return 0; // equal
	  },
	  	initialize: function( models, options ) {
	  	if (options != undefined)
	  	{
	  		this.url = '/api/report/'+options.reportID
	  	}
	  }
	});

	return {
	  Model: Report,
	  Collection: ReportCollection,
	};

});