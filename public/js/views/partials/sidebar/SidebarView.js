define([
  'baseview',
  '../layers/LayersView',
  '../filters/FiltersView',
  '../shiplist/ShipListView',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, LayersView, FiltersView, ShiplistView, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");
            var view = this;

            this.bindTo(Backbone.globalEvents, "showFiltersView", this.showFiltersView, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", this.showShiplistView, this);
        },


        render: function () {
            this.$el.html(sidebarViewTemplate);

            var layersView = new LayersView();

            layersView.preRender($("#layersContainer"), function() {
                layersView.render();
            });
            this.addSubView(layersView);

            return this;
        }
    });

    return SidebarView;
});

