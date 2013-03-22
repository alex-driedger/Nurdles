define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/map/TopToolsRow.html'
], function($, _, Backbone, topToolsTemplate){
    var TopToolsRow = Backbone.View.extend({
        initialize: function(args) {
            this.$el = args || $("#controlsContainer");
        },

        render: function () {
            this.$el.html(topToolsTemplate);
        }
    });

    return TopToolsRow;
});

