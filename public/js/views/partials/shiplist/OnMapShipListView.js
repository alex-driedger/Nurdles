define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/OnMapShipListView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, shiplistOnMapTemplate){
    var OnMapShipListView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});
        },

        template: _.template(shiplistOnMapTemplate),

        events: {},

        preRender: function(callback) {

            return this;
        },

        render: function () {
            this.$el.html(this.template({
                ships: this.ships 
            }));

            return this;
        }
    });

    return OnMapShipListView;
});

