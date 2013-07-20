define([
  'baseview',
  'openlayersutil',
  './NewLayerModalView',
  'text!templates/partials/layers/SavedBaseLayerView.html'
], function(Baseview, OpenLayersUtil, NewLayerModalView, savedBaseLayerTemplate){

    var SavedBaseLayerView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(savedBaseLayerTemplate),

        events: {
            "click .editLayer": "expandDetails"
        },

        expandDetails: function(e) {
            e.stopPropagation();
            var layerId = this.$(e.currentTarget).prop("id").split("-")[0],
                arrow = this.$("#" + layerId + "-arrow"),
                arrowSrc = arrow.prop("src");

            $("#" + layerId + "-container").slideToggle();
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model,
            }));
            
            this.delegateEvents();

            return this;
        }
    });

    return SavedBaseLayerView;
});



