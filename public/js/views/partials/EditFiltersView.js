define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/EditFiltersView.html'
], function($, _, Backbone, editFiltersTemplate){
    var EditFiltersView = Backbone.View.extend({
        initialize: function(args) {
            if (!args)
                this.$el = $("#newFilter");
        },

        render: function () {
            this.$el.html(editFiltersTemplate);
        }
    });

    return EditFiltersView;
});


