define([
  'baseview',
  'text!templates/partials/sidebar/SideBarToolsRow.html'
], function(Baseview, sidebarToolsRow){
    var SideBarToolsRow = Baseview.extend({
        initialize: function(args) {
            if (!args) {
                this.$el = $("#sidebarToolsContainer");
            }

            this.bindTo(Backbone.globalEvents, "activatePane", this.activatePane, this);
        },

        events: {
            "click #mapLayers": "showMapLayersView",
            "click #filters": "showFiltersView",
            "click #shiplist": "showShiplistView"
        },

        activatePane: function(buttonToSimulateClick) {
            this.swapActiveTab(buttonToSimulateClick);
        },

        swapActiveTab: function(tabToBecomeActive) {
            $("#sidebarToolsContainer .btn").removeClass("active");
            tabToBecomeActive.addClass("active");
        },

        showFiltersView: function(e) {
            this.swapActiveTab($("#filters"));
            Backbone.globalEvents.trigger("showFiltersView");
        },

        showMapLayersView: function(e) {
            this.swapActiveTab($("#mapLayers"));
            Backbone.globalEvents.trigger("showMapLayersView");
        },

        showShiplistView: function(e) {
            this.swapActiveTab($("#shiplist"));
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


