define([
  'baseview',
  '../filters/FiltersView',
  '../layers/MapLayersView',
  '../shiplist/ShipListView',
  '../sidebar/SideBarToolsRow',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, FiltersView, MapLayersView, ShiplistView, SideBarToolsRow, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");
            var view = this;

            this.bindTo(Backbone.globalEvents, "showMapLayersView", this.showMapLayersView, this);
            this.bindTo(Backbone.globalEvents, "showFiltersView", this.showFiltersView, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", this.showShiplistView, this);
            this.bindTo(Backbone.globalEvents, "search", function() { 
                if ($("#sidebar").css("style", "none") || !$("#shiplist").hasClass("active")) {
                    Backbone.globalEvents.trigger("activatePane", $("#shiplist"));
                    view.showShiplistView(true); 
                }
            }, this);
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
            this.closeDynamicContainers();
            var filtersView = new FiltersView();

            filtersView.preRender($("#toolContainer"), function() {
                filtersView.render(false, true);
            });
            this.addSubView(filtersView);
        },

        showMapLayersView: function() {
            this.closeDynamicContainers();
            var mapLayersView = new MapLayersView();

            mapLayersView.preRender($("#toolContainer"), function() {
                mapLayersView.render();
            });
            this.addSubView(mapLayersView);
        },

        showShiplistView: function(fromSearch) {
            this.closeDynamicContainers();
            var shiplistView = new ShiplistView({fromSearch: fromSearch});

            shiplistView.preRender($("#toolContainer"), function() {
                shiplistView.render();
            });
            this.addSubView(shiplistView);
        },

        render: function () {
            this.$el.html(sidebarViewTemplate);

            var sidebarTools = new SideBarToolsRow(),
                filtersView = new FiltersView();

            sidebarTools.render();
            filtersView.preRender($("#toolContainer"), function() {
                filtersView.render();
            });
            this.addSubView(sidebarTools);
            this.addSubView(filtersView);

            return this;
        }
    });

    return SidebarView;
});

