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
            "click .layerCheckbox": "handleLayerToggle"
        },

        handleLayerReorder: function() {
            var activeLayers = $( "#sortableViewLayers").sortable( "toArray" ).reverse(),
                baseZIndex = 10;

            Backbone.globalEvents.trigger("layersReordered", activeLayers);
            console.log($("#sortableViewLayers").sortable("toArray"));
        },

        handleLayerToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id"),
                isActivated = target.prop("checked"),
                layer = this.layers.findWhere({_id: id});


            target.parent().closest("li").toggleClass("ui-state-disabled");

            layer.set("active", isActivated);
            Backbone.globalEvents.trigger("layersChanged", this.layers);

            layer.update();

        },

        preRender: function() {
            this.$el.html(this.template({layers: this.layers}));
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

