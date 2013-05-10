define([
  'baseview',
  '../filters/FiltersView',
  '../layers/MapLayersView',
  '../sidebar/SideBarToolsRow',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, FiltersView, MapLayersView, SideBarToolsRow, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");

            this.bindTo(Backbone.globalEvents, "showMapLayersView", this.showMapLayersView, this);
        },

        showMapLayersView: function() {
            var mapLayersView = new MapLayersView(),
                view = this;
            this.eachSubview(function(subview) {
                if (subview.isDynamicContainer) {
                    view.removeSubView(subview.cid);
                    subview.close();
                };
            });
            mapLayersView.render().$el.appendTo("#toolContainer");

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

