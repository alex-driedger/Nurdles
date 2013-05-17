define([
  'baseview',
  'openlayersutil',
  './MapLayersDetailsView',
  'text!templates/partials/layers/SavedMapLayersView.html'
], function(Baseview, Utils, MapLayersDetailsView, savedMapLayersTemplate){
    var private = {
    };

    var SavedMapLayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(savedMapLayersTemplate),

        events: {
        },

        loadSavedLayersList: function(layers, view) {
            view.$el.html(view.template());

            layers.forEach(function(layer) {
                var detailsView = new MapLayersDetailsView({
                    model: layer,
                });

                view.addSubView(detailsView);
                view.$el.append(detailsView.preRender().$el);
                detailsView.render();
            });
        },

        render: function (isLocalRender) {
            if (typeof isLocalRender == "undefined" || isLocalRender == false) {
                var view = this,
                    layersWithActiveInfoInjected = [];

                this.layers.fetch({
                    url: "/api/layers/getAllForUser",
                    success: function(list, res, opt) {
                        view.loadSavedLayersList(list.models, view);

                    },
                    error: function(err) {
                        console.log("ERROR: ", err);
                    }
                });
            }
            else {
                console.log("Using cached");
                this.loadSavedFiltersView(this.filters, this);
                this.delegateEvents(this.events);
            }

            return this;
        }
    });

    return SavedMapLayersView;
});

