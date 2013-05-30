define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/shiplist/ShiplistTrackedView.html'
], function(Baseview, OpenLayersUtil, shiplistTrackedTemplate){
    var ShiplistTrackedView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(shiplistTrackedTemplate),

        events: {},

        preRender: function(callback) {

            return this;
        },

        render: function () {

            return this;
        }
    });

    return ShiplistTrackedView;
});

