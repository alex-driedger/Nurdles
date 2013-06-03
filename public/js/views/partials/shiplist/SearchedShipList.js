define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/SearchedShipList.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, searchedShipListTemplated){
    var TrackedShipListView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});

            this.bindTo(Backbone.globalEvents, "fetchedSearchedShips", this.transformShipData, this);
        },

        template: _.template(searchedShipListTemplated),

        events: {},

        transformShipData: function(eeShips) {
            var view = this;
            _.each(eeShips, function(eeShip) {
                view.ships.add(new Ship(eeShip.attributes));
            });

            this.render();

            if ($("#sidebar").hasClass("hide"))
                $("#separator").click();
        },

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

