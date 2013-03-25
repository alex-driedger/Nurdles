define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  var Filter = Backbone.Model.extend({
    initialize: function(attributes) {
        this.set("operators", []);
    },

    save: function(parameters) {
        //ajax request to server will go here
    },

    addOperator: function(operator) {
        this.get("operators").push(operator);
        this.trigger("addOperator");
    },

    removeOperator: function(id) {
        var operatorWithIndex = this.findOperatorById(id)
        this.get("operators").slice(operatorWithIndex.index, 1);
        this.trigger("change");
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
        this.trigger("change");
    },

    getOperators: function(attribute) {
        return this.get("operators");
    },
  });

  return Filter;
  
});

