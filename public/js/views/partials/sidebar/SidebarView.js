define([
  'baseview',
  '../searches/SearchView',
  '../filters/FiltersView',
  '../layers/MapLayersView',
  '../shiplist/ShipListView',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, SearchView, FiltersView, MapLayersView, ShiplistView, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");
            var view = this;

            this.bindTo(Backbone.globalEvents, "showMapLayersView", this.showMapLayersView, this);
            this.bindTo(Backbone.globalEvents, "showFiltersView", this.showFiltersView, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", this.showShiplistView, this);
        },


        render: function () {
            this.$el.html(sidebarViewTemplate);

            var searchView = new SearchView();

            searchView.preRender($("#searchContainer"), function() {
                searchView.render();
            });
            this.addSubView(searchView);

            var filtersView = new FiltersView();

            filtersView.preRender($("#toolContainer"), function() {
                filtersView.render();
            });
            this.addSubView(filtersView);

            return this;
        }
    });

    return SidebarView;
});

