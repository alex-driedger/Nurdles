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

        preRender: function() {
            this.$el.html(this.template({
                layer: this.model,
            }));

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

