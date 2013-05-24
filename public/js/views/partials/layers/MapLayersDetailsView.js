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
            "click .checkbox": "handleLayerToggle",
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

        handleLayerToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id"),
                isActivated = false;

            if (target.prop("checked")) {
                target.closest(".collapsed").addClass("selected");
                isActivated = true;
            }
            else {
                target.closest(".collapsed").removeClass("selected");
            }

            Backbone.globalEvents.trigger("activateLayer", {
                layer: this.model,
                activate: isActivated
            });
        },

        preRender: function() {
            this.$el.html(this.template({
                layer: this.model,
                eeLayer: this.eeLayer
            }));

            $( "#sortable" ).sortable({
                placeholder: "ui-state-highlight"
            });
            $("#sortable" ).disableSelection();

            console.log("EELAYER: ", this.eeLayer);

            this.delegateEvents(this.events);

            return this;

        },

        render: function() {
            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            return this;
        }
    });

    return MapLayersDetailsView;
});

