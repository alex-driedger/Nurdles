define([
  'baseview',
  'basecollection',
  'openlayersutil',
  './SavedMapLayersView',
  './NewMapLayerView',
  '../../../models/Layer',
  'text!templates/partials/layers/NewMapLayerView.html',
  'text!templates/partials/layers/MapLayersView.html'
], function(Baseview, BaseCollection, OpenLayersUtil, SavedMapLayersView, NewMapLayersView, Filter, newMapLayersViewTemplate, mapLayersViewTemplate){
    
    var private = {};

    var MapLayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(mapLayersViewTemplate),

        events: {},

        preRender: function(callback) {

        },

        render: function() {
            this.$el.html(this.template);
            return this;

        }
    });

    return MapLayersView;
});
