define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/SideBarToolsRow.html'
], function($, _, Backbone, sidebarToolsRow){
    var SideBarToolsRow = Backbone.View.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebarToolsContainer");
        },

        render: function () {
            this.$el.html(sidebarToolsRow);
        }
    });

    return SideBarToolsRow;
});


