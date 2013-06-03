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
                Backbone.globalEvents.trigger("showLoader");

            this.bindTo(Backbone.globalEvents, "activateLayer", this.activateLayer, this);
            this.bindTo(Backbone.globalEvents, "activateStyle", this.activateStyle, this);
        },

        template: _.template(savedMapLayersTemplate),

        events: {
        },

        loadSavedLayersList: function(layers, view) {
            view.$el.html(view.template());

            view.eeLayersContainer = $("#exactEarthLayersContainer");

            layers.eeStoredLayers.forEach(function(layer) {
                var detailsView = new MapLayersDetailsView({
                    model: layer,
                    eeLayer: _.findWhere(view.eeLayers, {Name: layer.get("name")}),
                    styles: layer.get("exactEarthParams").STYLES
                });

                view.addSubView(detailsView);
                view.eeLayersContainer.append(detailsView.preRender().$el);
                detailsView.render();
            });

            view.externalLayersContainer = $("#externalLayersContainer");
            layers.customLayers.forEach(function(layer) {
                var detailsView = new MapLayersDetailsView({
                    model: layer
                });

                view.addSubView(detailsView);
                view.externalLayersContainer.append(detailsView.preRender().$el);
                detailsView.render();
            });

            view.baseLayersContainer = $("#baseLayersContainer");
            layers.baseLayers.forEach(function(layer) {
                var detailsView = new MapLayersDetailsView({
                    model: layer
                });

                view.addSubView(detailsView);
                view.baseLayersContainer.append(detailsView.preRender().$el);
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
                        view.loadSavedLayersList(Utils.parseLayerTypes(list), view);
                        Backbone.globalEvents.trigger("hideLoader");

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

