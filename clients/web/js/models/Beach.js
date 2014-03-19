define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Beach = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/beach',
	});
	var BeachCollection = Backbone.Collection.extend({
	  url: '/api/beach',
	  model: Beach,
	  comparator: function(e1, e2)
	  {
	  	if (e1.get('created') > e2.get('created')) return -1; // before
  		if (e1.get('created') < e2.get('created')) return 1; // before
  		return 0; // equal
	  }, 
	  	 initialize: function( models, options ) {
	  	 	console.log(options)
		  	if (options != undefined)
		  	{
		  		if (options.beachID != undefined)
		  		{
		  			this.url = '/api/beach/'+ options.beachID
		  		} else if (options.lat != undefined)
		  		{
			  		this.url = '/api/beach/lat='+options.lat+'/lon='+options.lon +'/amount=' + options.amount
			  	} else if (options.limit == undefined)
		  		{
		  			this.url = "/api/beach/id/" + options.attribute + "/" + options.data
		  		}  else
		  		{
		  			this.url = "/api/beach/id/" + options.attribute + "/" + options.data + "/" + options.limit
		  		}
		  	}
		}
	});

	return {
	  Model: Beach,
	  Collection: BeachCollection
	};

});