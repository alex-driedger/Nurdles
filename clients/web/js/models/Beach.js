define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Beach = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/beach',
	  defaults: function () {
	  	var d = new Date()
	    return {
        beachName: "Beach whatever",
        city: "Kitchener",
        state: "Ontario",
        country: "Canada",
        lat: 0,
        lon: 0,
        address: "123 address dr",
        groomed: "UNKNOWN"
	    };
	  },
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
	  		if (options.beachID != undefined)
	  		{
	  			this.url = '/api/beach/'+options.beachID
	  		} else if (options.lat != undefined)
	  		{
		  		this.url = '/api/beach/lat='+options.lat+'/lon='+options.lon +'/amount=' + options.amount
		  	} else 
	  		{
	  			this.url = "/api/beach/test/" + options.data
	  		}
	  	}
	  }
	});

	return {
	  Model: Beach,
	  Collection: BeachCollection
	};

});