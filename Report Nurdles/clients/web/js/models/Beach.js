define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Beach = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/beach',
	  	initialize: function( models, options ) {
	  		if (options != undefined)
	  		{
	  			this.url = '/api/beach/' + options.id
	  		}
		  	if (models != undefined)
		  	{
		  		if (models.id_ != undefined)
		  		{
		  			this.url = '/api/beach/update/' + models.id_
		  		} else
		  		{
		  			this.url = '/api/beach/create'
		  		}
		  	}
		}
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
		  	if (options != undefined)
		  	{
		  		if (options.request != undefined)
		  		{
		  			this.url = '/api/beach/forecast/'+options.lat+"/"+options.lon
		  		} else if (options.update != undefined)
		  		{
		  			this.url = '/api/beach/update/' + options.id
		  		} else if (options.beachID != undefined)
		  		{
		  			this.url = '/api/beach/'+ options.beachID
		  		} else if (options.lat != undefined)
		  		{
			  		this.url = '/api/beach/lat='+options.lat+'/lon='+options.lon +'/amount=' + options.amount
			  	} else if (options.id != undefined)
		  		{
		  			this.url = 'api/beach/destroy/' + options.id
		  		} else if (options.limit == undefined)
		  		{
		  			this.url = "/api/beach/id/" + options.attribute + "/" + options.data
		  		} else
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