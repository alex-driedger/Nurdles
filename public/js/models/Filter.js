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
        console.log("ADDING: ", filterOperator);
        this.get("operators").add(filterOperator);
        this.trigger("change");
    },

    removeOperator: function(cid) {
        var operator = this.get("operators").findWhere({cid: cid})
        console.log("REMOVING: ", operator);
        this.get("operators").remove(operator);
        this.trigger("change");
    }
  });

  return Filter;
  
});

