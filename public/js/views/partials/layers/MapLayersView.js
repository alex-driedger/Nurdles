define([
  'baseview',
  'basecollection',
  'openlayersutil',
  './SavedMapLayersView',
  './NewMapLayerView',
  '../../../models/Layer',
  'text!templates/partials/layers/NewMapLayerView.html',
  'text!templates/partials/layers/MapLayersView.html'
], function(Baseview, BaseCollection, OpenLayersUtil, SavedMapLayersView, NewMapLayerView, Layer, newMapLayersViewTemplate, mapLayersViewTemplate){
    
    var private = {
    };

    var MapLayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.isDynamicContainer = true;
            this.eeLayers = null;

            this.layers = new BaseCollection([], {model: Layer});
        },

        template: _.template(mapLayersViewTemplate),

        events: {},

        preRender: function(callback) {
            var view = this;
            OpenLayersUtil.getLayers(null, function(err, eeLayers) {
                view.eeLayers = eeLayers;
                view.$el.html(view.template());
                callback();
            });

            return this;
        },

        render: function () {
            var newMapLayersView = new NewMapLayerView({
                    $el: $("#newMapLayer"),
                }),
                savedMapLayersView = new SavedMapLayersView({
                    $el: $("#savedMapLayers"),
                    layers: this.layers,
                    eeLayers: this.eeLayers
                });

            this.addSubView(newMapLayersView);
            this.addSubView(savedMapLayersView);
            newMapLayersView.render();
            savedMapLayersView.render();

            return this;
        }
    });

    return MapLayersView;
});
