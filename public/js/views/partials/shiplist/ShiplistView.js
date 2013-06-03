define([
  'baseview',
  'openlayersutil',
  './SearchedShipList',
  './TrackedShipListView',
  './OnMapShipListView',
  'text!templates/partials/shiplist/ShipListView.html'
], function(Baseview, OpenLayersUtil, SearchedShipList, TrackedShipListView, OnMapShipListView, shipListTemplate){
    var ShipListView = Baseview.extend({
        initialize: function(args) {
            this.fromSearch = false;
            this.initArgs(args);
            this.isDynamicContainer = true;

        },

        template: _.template(shipListTemplate),

        events: {},


        preRender: function(containingDiv, callback) {
            this.$el.appendTo(containingDiv)
            this.fadeInViewElements(this.template());
            callback();

            return this;
        },

        render: function () {
            var searchedShipListView = new SearchedShipList({
                    $el: $("#searchedShips")
                }),
                trackedShipListView = new TrackedShipListView({
                    $el: $("#trackedShips"),
                }),
                onMapShipListView = new OnMapShipListView({
                    $el: $("#shipList"),
                    load: !this.fromSearch
                });

            this.addSubView(searchedShipListView);
            this.addSubView(trackedShipListView);
            this.addSubView(onMapShipListView);
            trackedShipListView.render();
            onMapShipListView.render();

            return this;
        }
    });

    return ShipListView;
});

