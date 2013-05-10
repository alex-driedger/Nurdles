define([
  'baseview',
  'basecollection',
  'openlayersutil',
  './SavedMapLayersView',
  './NewMapLayersView',
  '../../../models/Layer',
  'text!templates/partials/layers/NewMapLayersView.html'
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

        }
    });

    return MapLayersView;
});
