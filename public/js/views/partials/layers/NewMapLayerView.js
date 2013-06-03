define([
  'baseview',
  'openlayersutil',
  '../../../models/Layer',
  'text!templates/partials/layers/NewMapLayerView.html'
], function(Baseview, Utils, Layer, newMapLayerTemplate){
    var private = {
    };

    var NewMapLayerView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.model = new Layer();

        },

        template: _.template(newMapLayerTemplate),

        events: {
        },

        render: function (firstTime) {
            this.$el.html(this.template({layer: this.model}));

            return this;
        }
    });

    return NewMapLayerView;
});

