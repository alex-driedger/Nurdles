define([
  'baseview',
  'text!templates/partials/sidebar/SideBarToolsRow.html'
], function(Baseview, sidebarToolsRow){
    var SideBarToolsRow = Baseview.extend({
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


