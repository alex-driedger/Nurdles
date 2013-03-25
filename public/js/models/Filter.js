define([
  'jquery',
  'underscore',
  'backbone',
  '../collections/FilterOperatorsCollection',
  './FilterOperator'
], function($, _, Backbone, FilterOperatorsCollection, FilterOperator){

  var Filter = Backbone.Model.extend({
    initialize: function(attributes) {
        this.set("operators", []);
    },

    save: function(parameters) {
        //ajax request to server will go here
    },

    addOperator: function(filterOperator) {
        this.get("operators").add(filterOperator);
    },

    removeOperator: function(id) {
        var operatorWithIndex = this.findOperatorById(id)
        this.get("operators").slice(operatorWithIndex.index, 1);
    },

    findOperatorById: function(id) {
        var operators = this.get("operators");
        _.each(operators, function(operator, index) {
            if (operator.id === id)
                return {
                    operator: operator,
                    index: index
                }
        });
    },

    clearOperators: function() {
        this.get("operators").reset();
    },

    getOperators: function(attribute) {
        return this.get("operators");
    },
  });

  return Filter;
  
});

