define([
  'jquery',
  'underscore',
  'backbone',
  '../collections/FilterOperatorsCollection',
  './FilterOperator'
], function($, _, Backbone, FilterOperatorsCollection, FilterOperator){

  var Filter = Backbone.Model.extend({
    initialize: function(attributes) {
        this.set("operators", new FilterOperatorsCollection());
        this.get("operators").add(new FilterOperator());
    },

    save: function(parameters) {
        //ajax request to server will go here
    },

    addOperator: function(parameters) {
        this.operators.add(new FilterOperator(parameters));
    }
  });

  return Filter;
  
});

