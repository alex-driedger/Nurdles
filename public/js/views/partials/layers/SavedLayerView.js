define([
  'baseview',
  'openlayersutil',
  './NewFilterModalView',
  'text!templates/partials/layers/SavedLayerView.html'
], function(Baseview, OpenLayersUtil, NewFilterModalView, savedLayerTemplate){

    var SavedLayerTemplate = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.events["click #" + this.model.get("_id") + "-delete"] = "deleteLayer";
        },

        template: _.template(savedLayerTemplate),

        events: {
            "click .feature": "addNewFilter",
            "click .editLayer": "expandDetails"
        },

        expandDetails: function(e) {
            e.stopPropagation();
            var layerId = this.$(e.currentTarget).prop("id").split("-")[0],
                arrow = this.$("#" + layerId + "-arrow"),
                arrowSrc = arrow.prop("src");

            $("#" + layerId + "-container").slideToggle();
        },

        deleteLayer: function(e) {
            var view = this;
            var order = parseInt(this.model.get("order"))
            var layers = this.model.collection;

            layers.each(function(layer) {
                if (layer.get("order") > order) {
                    layer.set("order", layer.get("order") - 1);
                    layer.update();
                }
            });

            this.model.destroy({
                url: "/api/layers/" + this.model.get("_id"),
                success: function(res) {
                    console.log("Deleted layer");
                    Backbone.globalEvents.trigger("layerRemoved");
                },
                error: function(error) {
                    console.log("error");
                }
            });
        },

        addNewFilter: function(e) {
            e.preventDefault();
            var modal = new NewFilterModalView({
                property: $(e.target).prop("id").split("-")[0],
                type: $(e.target).prop("id").split("-")[1],
                prettyProperty: $(e.target).html()
            });
            modal.attachToPopup($("#modalPopup"));
            modal.render();

            modal.show();
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model,
                numberTypes: this.numberTypes,
                stringTypes: this.stringTypes,
                spatialTypes: this.spatialTypes
            }));
            
            this.delegateEvents();

            return this;
        }
    });

    return SavedLayerTemplate;
});



