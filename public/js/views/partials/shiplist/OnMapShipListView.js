define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/OnMapShipListView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, shiplistOnMapTemplate){
    var OnMapShipListView = Baseview.extend({
        initialize: function(args) {
            var view = this;

            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});

            this.bindTo(Backbone.globalEvents, "fetchedShipsList", this.displayShipList, this);
            this.bindTo(Backbone.globalEvents, "zoomEnd", function() {
                view.ships.reset();
                view.load = true;
                view.showLoadScreen();
                Backbone.globalEvents.trigger("getShipList");
            }, this);

            if (this.load) {
                Backbone.globalEvents.trigger("getShipList");
            }

        },

        template: _.template(shiplistOnMapTemplate),

        events: {},

        displayShipList: function(eeShips) {
            console.log(eeShips);
            var view = this;
            _.each(eeShips, function(eeShip) {
                view.ships.add(new Ship(eeShip.attributes));
            });

            this.load = false;
            this.reRender();
        },

        preRender: function(callback) {

            return this;
        },

        render: function () {
            this.fadeInViewElements((this.template({
                ships: this.ships,
                load: this.load
            })));

            return this;
        },

        showLoadScreen: function () {
            this.$el.html((this.template({
                ships: this.ships,
                load: this.load
            })));

            return this;
        }
    });

    return OnMapShipListView;
});

