define([
  'baseview',
  'openlayersutil',
  '../../../models/Layer',
  'text!templates/partials/layers/MapLayerDetailsView.html'
], function(Baseview, Utils, Layer, mapLayerDetailsViewTemplate){

    var private = {};

    var MapLayersDetailsView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(mapLayerDetailsViewTemplate),

        events: {
        },

        preRender: function() {
            this.$el.html(this.template({
                layer: this.model,
            }));

            this.delegateEvents(this.events);
            
            return this;

        },

        render: function() {

        }
    });

    return MapLayersDetailsView;
});

