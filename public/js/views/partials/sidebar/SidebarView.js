define([
  'baseview',
  '../layers/SavedLayerView',
  '../filters/FiltersView',
  '../shiplist/ShipListView',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, SavedLayerView, FiltersView, ShiplistView, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");
            var view = this;

            this.bindTo(Backbone.globalEvents, "showFiltersView", this.showFiltersView, this);
            this.bindTo(Backbone.globalEvents, "showShiplistView", this.showShiplistView, this);
        },


        render: function () {
            this.$el.html(sidebarViewTemplate);

            var savedLayerView = new SavedLayerView();

            savedLayerView.preRender($("#layerContainer"), function() {
                savedLayerView.render();
            });
            this.addSubView(savedLayerView);

            return this;
        }
    });

    return SidebarView;
});

