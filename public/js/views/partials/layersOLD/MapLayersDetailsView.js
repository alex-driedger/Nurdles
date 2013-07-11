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
            "click .layerExapnd": "handleExpand",
            "click .legendExpand": "handleLegendExpand",
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

        handleLegendExpand: function(e) {
            var headerDiv = $(e.target).closest("div .legendExpand"),
                id = headerDiv.parent().prop("id"),
                divToToggle = headerDiv.next();

            divToToggle.slideToggle(200);
            $("#" + id + "-icon").prop("src", function(index, oldValue) {
                if (oldValue.match(/down/)) 
                    return oldValue.replace(/down/, "up");
                else
                    return oldValue.replace(/up/, "down");
            });

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
                styles: this.styles
            }));
            return this;

        },

        render: function() {
            var view = this,
                styles;

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
            if (!this.model.get("isBaseLayer")) {
                styles  = this.eeLayer.Style;
                if (!(styles instanceof Array)) 
                   styles = [styles]; //EE sends back an object (not an array) if there's only one style...

                _.each(styles, function(style) {
                    $("#" + style.Name + "-legend-container").hide();
                });
            }

            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            return this;
        }
    });

    return MapLayersDetailsView;
});

