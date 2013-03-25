define([
  'jquery',
  'underscore',
  'backbone',
  '../../../models/Filter',
  '../../../models/FilterOperator',
  'text!templates/partials/filters/EditFiltersView.html'
], function($, _, Backbone, Filter, FilterOperator, editFiltersTemplate){
    var EditFiltersView = Backbone.View.extend({
        initialize: function(args) {
            if (!args)
                this.$el = $("#newFilter");

            this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.listenTo(this.model.get("operators"), "all", this.cacheOperators);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click #clearFilter": "clearFilter"
        },

        cacheOperators: function() {
            this.model.getOperators().forEach(function(operator) {
                operator.type = $("#" + operator.cid + "-type").val();
                operator.operator = $("#" + operator.cid + "-operator").val();
                operator.value = $("#" + operator.cid + "-value").val();
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
                type: $("#newType").val(),
                operator: $("#newOperator").val(),
                value: [$("#newValue").val()]
            };

            this.model.addOperator(newOperator);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));;
        }
    });

    return EditFiltersView;
});
