define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/map/ViewLayersView.html'
], function(Baseview, Utils, viewLayersTemplate){
    var private = {};

    var ViewLayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

        },

        template: _.template(viewLayersTemplate),

        events: {
            "click .layerCheckbox": "handleLayerToggle",
            "click .baseLayerRadio": "handleBaseLayerSelect"
        },

        handleLayerReorder: function() {
            var activeLayers = $( "#sortableViewLayers").sortable( "toArray" ).reverse();

            Backbone.globalEvents.trigger("layersReordered", activeLayers);

            this.layers.each(function(layer) {
                if (_.contains(activeLayers, layer.get("name"))) {
                    layer.set("order", activeLayers.indexOf(layer.get("name")) + 1);
                    layer.update();
                }
            });
                    
            console.log($("#sortableViewLayers").sortable("toArray"));
        },

        handleLayerToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id"),
                isActivated = target.prop("checked"),
                layer = this.layers.findWhere({_id: id});


            target.parent().closest("li").toggleClass("ui-state-disabled");

            if (isActivated) {
                layer.set("active", true);
                this.handleLayerReorder();
            }
            else {
                layer.set("active", false);
                layer.update();
            }

            Backbone.globalEvents.trigger("layersChanged", this.layers);
        },

        handleBaseLayerSelect: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id"),
                isActivated = target.prop("checked"),
                layer = this.baseLayers.findWhere({_id: id});

            layer.set("active", isActivated);
            //layer.update();

            Backbone.globalEvents.trigger("baseLayerSelected", layer);
        },

        preRender: function() {
            this.$el.html(this.template({
                layers: this.layers,
                baseLayers: this.baseLayers
            }));
            return this;
        },

        render: function() {
            var view = this;
            $("#sortableViewLayers").sortable({
                placeholder: "ui-state-highlight",
                items: "li:not(.ui-state-disabled)",
                cancel: ".ui-state-disabled",
                stop: function(event, ui) {
                    view.handleLayerReorder();
                }
            });
        }
    });

    return ViewLayersView;
});

