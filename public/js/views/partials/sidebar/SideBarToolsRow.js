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

        events: {
            "click #mapLayers": "showMapLayersView",
            "click #filters": "showFiltersView",
            "click #shiplist": "showShiplistView"
        },

        showFiltersView: function(e) {
            $("#sidebarToolsContainer .btn").removeClass("active");
            $("#filters").addClass("active");
            Backbone.globalEvents.trigger("showFiltersView");
        },

        showMapLayersView: function(e) {
            $("#sidebarToolsContainer .btn").removeClass("active");
            $("#mapLayers").addClass("active");
            Backbone.globalEvents.trigger("showMapLayersView");
        },

        showShiplistView: function(e) {
            $("#sidebarToolsContainer .btn").removeClass("active");
            $("#shiplist").addClass("active");
            Backbone.globalEvents.trigger("showShiplistView");
        },

        render: function () {
            this.$el.html(sidebarToolsRow);
            //TODO: Grab user preferences so we know which button to highlight
            $("#filters").addClass("active");
        }
    });

    return SideBarToolsRow;
});


