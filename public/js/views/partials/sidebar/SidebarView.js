define([
  'baseview',
  '../filters/FiltersView',
  '../layers/MapLayersView',
  '../shiplist/ShiplistView',
  '../sidebar/SideBarToolsRow',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, FiltersView, MapLayersView, ShiplistView, SideBarToolsRow, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");

            this.bindTo(Backbone.globalEvents, "showMapLayersView", this.showMapLayersView, this);
            this.bindTo(Backbone.globalEvents, "showFiltersView", this.showFiltersView, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", this.showShiplistView, this);
        },

        closeDynamicContainers: function() {
            var view = this;
            this.eachSubview(function(subview) {
                if (subview.isDynamicContainer) {
                    view.removeSubView(subview);
                    subview.close();
                };
            });
            
        },

        showFiltersView: function() {
            var filtersView = new FiltersView();

            this.closeDynamicContainers();
            filtersView.preRender(function() {
                filtersView.$el.appendTo("#toolContainer");
                filtersView.render();
            });
            this.addSubView(filtersView);
        },

        showMapLayersView: function() {
            var mapLayersView = new MapLayersView();
            Backbone.globalEvents.trigger("showLoader");

            this.closeDynamicContainers();
            mapLayersView.preRender(function() {
                mapLayersView.$el.appendTo("#toolContainer");
                mapLayersView.render();
            });
            this.addSubView(mapLayersView);
        },

        showShiplistView: function() {
            var shiplistView = new ShiplistView();

            this.closeDynamicContainers();
            shiplistView.preRender(function() {
                shiplistView.$el.appendTo("#toolContainer");
                shiplistView.render();
            });
            this.addSubView(shiplistView);
        },

        render: function () {
            this.$el.html(sidebarViewTemplate);

            var sidebarTools = new SideBarToolsRow(),
                filtersView = new FiltersView();

            sidebarTools.render();
            filtersView.preRender(function() {
                filtersView.$el.appendTo("#toolContainer");
                filtersView.render();
            });
            this.addSubView(sidebarTools);
            this.addSubView(filtersView);

            return this;
        }
    });

    return SidebarView;
});

