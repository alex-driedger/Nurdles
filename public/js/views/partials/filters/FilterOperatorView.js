define([
  'jquery',
  'underscore',
  'backbone',
  '../../../models/FilterOperator',
  'text!templates/partials/filters/FilterOperator.html'
], function($, _, Backbone, FilterOperator, editFiltersTemplate){
    var FilterOperatorView = Backbone.View.extend({
        initialize: function(args) {
            this.model = new FilterOperator();
        },

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow"
        },

        template: _.template(editFiltersTemplate),

        render: function () {
            this.$el.html(this.template);
        }
    });

    return FilterOperatorView;
});

