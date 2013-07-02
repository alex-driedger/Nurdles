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

            if (!this.get("topOperatorId"))
                this.set("topOperatorId", 0);

            if (!this.get("topBinId"))
                this.set("topBinId", 0);

            this.operatorCounter = this.get("topOperatorId");
            this.topBinId = this.get("topBinId");
        },

        getBins: function() {
            return this.get("bins");
        },

        setBins: function(bins) {
            this.set("bins", bins);
        },

        findBinById: function(id) {
            return _.findWhere(this.get("bins"), {id: id});
        },

        addBin: function() {
            var bin = {};
            this.set("topBinId", ++this.topBinId);

            bin.id = this.topBinId;
            bin.type = "&&";
            bin.operators = [];

            this.get("bins").push(bin);
            return bin.id;
        },

        removeBin: function(id) {
            var bins = this.getBins(),
                binsToKeep = _.reject(bins, function(bin) {
                    return bin.id == parseInt(id);
                }),
                bin = _.findWhere(bins, {id: parseInt(id)}),
                topLevelBin = this.get("topLevelBin");


            _.each(bin.operators, function(operator) {
                topLevelBin.operators.push(operator);
            });
            this.setBins(binsToKeep);
            delete bin;
        },

        setOperators: function(operators) {
            this.set("operators", operators);
        },

        addOperator: function(operator, isSubFilter) {
            this.set("topOperatorId", ++this.operatorCounter);
            operator.id = this.operatorCounter;
            if (isSubFilter)
                operator.set("id", operator.id);

            this.get("topLevelBin").operators.push(operator);
            this.trigger("addOperator");
        },

        removeOperator: function(operatorId, binId, isTopLevelBin) {
            var bin = isTopLevelBin ? this.get("topLevelBin") : _.findWhere(this.getBins(), {id: parseInt(binId)});

            bin.operators = _.reject(bin.operators, function(operator) {
                return operator.id == parseInt(operatorId);
            });

            console.log("Now have " + bin.operators.length + " operators in bin: " + binId);
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

