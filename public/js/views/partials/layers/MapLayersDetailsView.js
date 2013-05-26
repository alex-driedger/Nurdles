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
            this.isExpanded = this.isActive = false;
        },

        template: _.template(mapLayerDetailsViewTemplate),

        events: {
            "click .collapsed": "handleExpand",
            "click .styleCheckbox": "toggleStyle"
        },

        handleExpand: function(e) {
            var headerDiv = $(e.target).closest("div .collapsed"),
                divToToggle = headerDiv.next(),
                layerId = divToToggle.prop("id").split("-")[0];

            Backbone.globalEvents.trigger("toggleExpandedLayer", this.model);

            headerDiv.toggleClass("notExpanded");
            divToToggle.slideToggle(200);

            this.isExpanded = !this.isExpanded;
        },

        toggleStyle: function(e) {
            var target = $(e.target);
            e.stopImmediatePropagation();
            
            target.parent().closest("li").toggleClass("ui-state-disabled");
            this.handleStyleReorder();
        },

        handleStyleReorder: function() {
            var activeStyles = $( "#" + this.model.get("_id") + "-layer").sortable( "toArray" ).reverse(),
                layersDefinitions = "",
                exactEarthParams = this.model.get("exactEarthParams");

            for (var i = 0, len = activeStyles.length; i < len; i++) {
                layersDefinitions += this.model.get("name") + ",";
            }

            layersDefinitions = layersDefinitions.substring(0, layersDefinitions.length - 1); //Removing final comma

            exactEarthParams.STYLES = activeStyles.join(",");
            exactEarthParams.LAYERS = layersDefinitions;

            this.model.update();

            Backbone.globalEvents.trigger("layerStylesReordered", this.model);
        },

        preRender: function() {
            var view = this;

            this.$el.html(this.template({
                layer: this.model,
                eeLayer: this.eeLayer,
                styles: this.model.get("exactEarthParams").STYLES
            }));


            return this;

        },

        render: function() {
            var view = this;

            $( "#" + this.model.get("_id") + "-layer").sortable({
                placeholder: "ui-state-highlight",
                items: "li:not(.ui-state-disabled)",
                cancel: ".ui-state-disabled",
                stop: function(event, ui) {
                    view.handleStyleReorder();
                }
            });
            $("#" + this.model.get("_id")).disableSelection();

            console.log("EELAYER: ", this.eeLayer);

            this.delegateEvents(this.events);
            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            return this;
        }
    });

    return MapLayersDetailsView;
});

