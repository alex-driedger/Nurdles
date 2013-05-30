define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/shiplist/ShiplistView.html'
], function(Baseview, OpenLayersUtil, shipListTemplate){
    var ShiplistView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.isDynamicContainer = true;
        },

        template: _.template(shipListTemplate),

        events: {},

        preRender: function(callback) {
            this.$el.html(this.template());
            callback();

            return this;
        },

        render: function () {

            return this;
        }
    });

    return ShiplistView;
});

