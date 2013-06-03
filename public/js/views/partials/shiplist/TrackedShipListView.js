define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/TrackedShipListView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, trackedShipListTemplate){
    var TrackedShipListView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});
        },

        template: _.template(trackedShipListTemplate),

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

    return TrackedShipListView;
});

