define([
  'jquery',
  'underscore',
  'backbone',
  '../../../models/Filter',
  'text!templates/partials/filters/EditFiltersView.html'
], function($, _, Backbone, Filter, editFiltersTemplate){
    var private = {
        operatorCounter: 0
    };

    var EditFiltersView = Backbone.View.extend({
        initialize: function(args) {
            if (!args)
                this.$el = $("#newFilter");

            this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.listenTo(this.model, "change", this.cacheOperators);
            this.listenTo(this.model, "addOperator", this.render);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click #clearFilter": "clearFilter"
        },

        cacheOperators: function() {
            _.each(this.model.getOperators(), function(operator) {
                operator.type = $("#" + operator.id + "-type").val();
                operator.operator = $("#" + operator.id + "-operator").val();
                operator.value = $("#" + operator.id + "-value").val();
            });

            this.render();
        },

        clearFilter: function() {
            this.model.clearOperators();
        },

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
        },

        addRow: function(e) {
            var newOperator = {
                id: private.operatorCounter++,
                type: $("#newType").val(),
                operator: $("#newOperator").val(),
                values: [$("#newValue1").val()]
            };

            if ($("#newValue2").val() != "")
                newOperator.values.push($("#newValue2").val());

            console.log(newOperator);
            this.model.addOperator(newOperator);
            console.log("Operators: ", this.model.get("operators"));
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));;
        }
    });

    return EditFiltersView;
});
