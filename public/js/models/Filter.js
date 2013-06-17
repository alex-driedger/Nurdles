define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Filter = Backbone.Model.extend({
        idAttribute: "_id",

        initialize: function(attributes) {
            this.set("operators", []);
        },


        setOperators: function(operators) {
            this.set("operators", operators);
        },

        addOperator: function(operator) {
            this.get("operators").push(operator);
            this.trigger("addOperator");
        },

        removeOperator: function(order) {
            var operatorWithIndex = this.findOperatorByOrder(order)
            this.get("operators").splice(operatorWithIndex.index, 1);
            this.resetOperatorOrder(order);
            this.trigger("removeOperator");
            console.log("Now have " + this.get("operators").length + " operators");
        },

        findOperatorByOrder: function(order) {
            var operators = this.get("operators");
            for (var i = 0, len = operators.length; i < len; i++) {
                if (operators[i].order == order)
                    return {
                        operator: operators[i],
                        index: i
                    }
            }
        },

        resetOperatorOrder: function(lastOperatorRemoved) {
            var operators = this.getOperators();
            
            for (var i = lastOperatorRemoved, len = operators.length; i < len; i++) {
                operators[i].order--;
            }

            this.setOperators(operators);
        },

        clearOperators: function() {
            this.set("operators", []);
            this.trigger("clearOperators");
        },

        getOperators: function(attribute) {
            return this.get("operators");
        },

        update: function(success, fail, context) {
            this.save(null, { 
                url: "/api/filters/" + this.get("_id") + "/update",
                success: function(data) {
                    if (success) success(data, context);
                },
                fail: function(err) {
                    if (fail) fail(err, context);
                }
            });
        }
    });

    return Filter;

});

