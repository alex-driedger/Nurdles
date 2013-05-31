define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/shiplist/TrackedShipListView.html'
], function(Baseview, OpenLayersUtil, trackedShipListTemplate){
    var TrackedShipListView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(trackedShipListTemplate),

        events: {},

        preRender: function(callback) {

            return this;
        },

        render: function () {

            return this;
        }
    });

    return TrackedShipListView;
});

