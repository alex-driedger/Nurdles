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
    },

    save: function(parameters) {
        //ajax request to server will go here
    },

    addOperator: function(filterOperator) {
        this.get("operators").add(filterOperator);
    },

    removeOperator: function(cid) {
        var operator = this.get("operators").findWhere({cid: cid})
        this.get("operators").remove(operator);
    },

    clearOperators: function() {
        this.get("operators").reset();
    }
  });

  return Filter;
  
});

