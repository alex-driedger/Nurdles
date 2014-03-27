define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var Rate = Backbone.Model.extend({
		idAttribute: "_id",
	  urlRoot: '/api/rate',
	});
	var RateCollection = Backbone.Collection.extend({
	  url: '/api/rate',
	  model: Rate,
	  comparator: function(e1, e2)
	  {
	  	if (e1.get('created') > e2.get('created')) return -1; // before
  		if (e1.get('created') < e2.get('created')) return 1; // before
  		return 0; // equal
	  }
	});

	return {
	  Model: Rate,
	  Collection: RateCollection
	};

});