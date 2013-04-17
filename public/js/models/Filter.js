define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Filter = Backbone.Model.extend({
        initialize: function(attributes) {
            this.set("operators", []);
        },

        save: function(success, error) {
            $.ajax({
                url: "/api/filters/save",
                type: "POST",
                data: this.attributes,
                success: success,
                error: error
            });
        },

        addOperator: function(operator) {
            this.get("operators").push(operator);
            this.trigger("addOperator");
        },

        removeOperator: function(id) {
            var operatorWithIndex = this.findOperatorById(id)
            this.get("operators").splice(operatorWithIndex.index, 1);
            this.trigger("change");
            console.log("Now have " + this.get("operators").length + " operators");
        },

        findOperatorById: function(id) {
            var operators = this.get("operators");
            for (var i = 0, len = operators.length; i < len; i++) {
                if (operators[i].id == id)
                    return {
                        operator: operators[i],
                        index: i
                    }
            }
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

