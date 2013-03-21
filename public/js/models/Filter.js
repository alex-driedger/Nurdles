define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var Filter = Backbone.Model.extend({
    initialize: function(attributes) {
        this.operators = [];
    },

    create: function(parameters) {
    }

  return Filter;
  
});

