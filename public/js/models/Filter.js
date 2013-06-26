define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Filter = Backbone.Model.extend({
        idAttribute: "_id",
        operatorCounter: 0,

        initialize: function(attributes) {
            this.set("operators", []);
            this.set("topLevelBin", {type: "&&", operators: []});
            this.set("bins", []);
            this.operatorCounter = this.get("topOperatorId");
        },

        findBinById: function(id) {
            return _.findWhere(this.get("bins"), {id: id});
        },

        setOperators: function(operators) {
            this.set("operators", operators);
        },

        addOperator: function(operator, isSubFilter) {
            this.set("topOperatorId", this.operatorCounter++);

            this.get("topLevelBin").operators.push(operator);
            this.trigger("addOperator");
        },

        removeOperator: function(order) {
            var operatorWithIndex = this.findOperatorByOrder(order)
            this.get("operators").splice(operatorWithIndex.index, 1);
            this.operatorCounter--;
            this.resetOperatorOrder(order);
            this.trigger("removeOperator");
            console.log("Now have " + this.get("operators").length + " operators");
        },

        moveOperatorToBin: function(operatorId, fromBin, toBin) {
            console.log(_.findWhere(this.get("bins"), {id: fromBin}));
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
                if (operators[i].set)
                    operators[i].set("order", operators[i].order);
            }

            this.setOperators(operators);
        },

        clearOperators: function() {
            this.set("operators", []);
            this.operatorCounter = 0;
            this.trigger("clearOperators");
        },

        getOperators: function(attribute) {
            return this.get("operators");
        },

        update: function(success, fail, context) {
            console.log("TEST");
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

