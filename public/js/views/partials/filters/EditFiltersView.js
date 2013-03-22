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
            this.model.on("change", this.render, this);

        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow"
        },

        deleteRow: function(e) {
            this.model.removeOperator($(e.target).closest("tr").id);
        },

        addRow: function(e) {
            this.model.addOperator(new FilterOperator());
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));;
        }
    });

    return EditFiltersView;
});
