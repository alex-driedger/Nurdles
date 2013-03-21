define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/SideBarToolsRow.html'
], function($, _, Backbone, sidebarToolsRow){
    var SideBarToolsRow = Backbone.View.extend({
        initialize: function(args) {
            if (!args) {
                this.$el = $("#sidebarToolsContainer");
            }
            else {
            }
        },

        render: function () {
            this.$el.html(sidebarToolsRow);
            //TODO: Grab user preferences so we know which button to highlight
            $("#filters").addClass("active");
        }
    });

    return SideBarToolsRow;
});


