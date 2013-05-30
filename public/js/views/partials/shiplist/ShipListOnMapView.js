define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/shiplist/ShiplistOnMapView.html'
], function(Baseview, OpenLayersUtil, shiplistOnMapTemplate){
    var ShiplistOnMapView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(shiplistOnMapTemplate),

        events: {},

        preRender: function(callback) {

            return this;
        },

        render: function () {

            return this;
        }
    });

    return ShiplistOnMapView;
});

