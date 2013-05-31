define([
  'baseview',
  'openlayersutil',
  './TrackedShipListView',
  './OnMapShipListView',
  'text!templates/partials/shiplist/ShipListView.html'
], function(Baseview, OpenLayersUtil, TrackedShipListView, OnMapShipListView, shipListTemplate){
    var ShipListView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.isDynamicContainer = true;
        },

        template: _.template(shipListTemplate),

        events: {},

        preRender: function(callback) {
            //this.$el.html(this.template());
            callback();

            return this;
        },

        render: function () {
            var trackedShipListView = new TrackedShipListView({
                    $el: $("#trackedShips"),
                }),
                onMapShipListView = new OnMapShipListView({
                    $el: $("#savedMapLayers")
                });

            this.addSubView(trackedShipListView);
            this.addSubView(onMapShipListView);
            trackedShipListView.render();
            onMapShipListView.render();

            return this;
        }
    });

    return ShipListView;
});

