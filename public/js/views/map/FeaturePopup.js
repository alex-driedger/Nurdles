define([
  'baseview',
   '../../components/OpenLayersPopup',
  'text!templates/partials/map/FeaturePopup.html'
], function(Baseview, PopupClass, featurePopupTemplate){
    var FeaturePopupView = Baseview.extend({
        initialize: function(data) {
            this.data = {};
            this.data.shipInformation = data.shipInformation;
            this.data.map = data.map;
            this.data.position = data.position;
        },

        template: _.template(featurePopupTemplate),

        render: function() {
            var size = new OpenLayers.Size(420,330);

            var context = this;
            popup = new PopupClass("featurePopup",
                                   this.data.position,
                                   size,
                                   "<h2>TEST</h2>" + "Description here",
                                   undefined, true, function(e) {
                                       this.destroy();
                                       context.close()
                                   }
                                  );

            this.$el.html(this.template(this.data.shipInformation));
            popup.setContentHTML(this.$el.html());
            this.data.map.addPopup(popup);

            return this;
        }
    });

    return FeaturePopupView;
});

