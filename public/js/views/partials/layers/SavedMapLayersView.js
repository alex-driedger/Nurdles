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

            this.activeFilters = [];
            this.bindTo(Backbone.globalEvents, "activateLayer", this.activateLayer, this);
        },

        template: _.template(savedMapLayersTemplate),

        events: {
        },

        loadSavedLayersList: function(layers, view) {
            view.$el.html(view.template());

            if (view.isExactEarthLayers)
                view.layersContainer = $("#exactEarthLayersContainer");
            else
                view.layersContainer = $("#externalLayersContainer");

            layers.forEach(function(layer) {
                var detailsView = new MapLayersDetailsView({
                    model: layer,
                });

                view.addSubView(detailsView);
                view.layersContainer.append(detailsView.preRender().$el);
                detailsView.render();
            });
        },

        activateLayer: function(data) {
            data.layer.set("active", data.activate);
            data.layer.save(null, {
                url: "/api/layers/" + data.layer.get("_id") + "/update",
                success: function(data) {
                    console.log("Save successful");
                }
            });

            Backbone.globalEvents.trigger("layersChanged", this.layers);
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

