define([
  'jquery',
  'underscore',
  'backbone',
  'FilterOperator'
], function($, _, Backbone, FilterOperator){

  var Filter = Backbone.Model.extend({
    initialize: function(attributes) {
        this.operators = [];
    },

    save: function(parameters) {
        //ajax request to server will go here
    },

    addOperator: function(parameters) {
        this.operators.push(new FilterOperator(parameters));
    }
  });

  return Filter;
  
});

