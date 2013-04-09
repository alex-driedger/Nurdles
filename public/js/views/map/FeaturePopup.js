define([
  'jquery',
  'underscore',
  'backbone',
   '../../components/OpenLayersPopup',
  'text!templates/partials/map/FeaturePopup.html'
], function($, _, Backbone, PopupClass, featurePopupTemplate){
    var FeaturePopupView = Backbone.View.extend({
        initialize: function(data, parentView) {
            this.data = {};
            this.data.shipInformation = data.shipInformation;
            this.data.map = data.map;
            this.data.position = data.position;
            this.parentView = parentView;
        },

        template: _.template(featurePopupTemplate),

        render: function(evt) {
            var size = new OpenLayers.Size(420,330);

            feature = evt.feature;
            var context = this;
            popup = new PopupClass("featurePopup",
                                   this.data.position,
                                   size,
                                   "<h2>TEST</h2>" + "Description here",
                                   undefined, true, function(e) {
                                       this.destroy();
                                       context.disposeOfView()
                                   }
                                  );

            this.$el.html(this.template(this.data.shipInformation));
            popup.setContentHTML(this.$el.html());
            this.data.map.addPopup(popup);

            return this;
        },

        disposeOfView: function() {
            //THIS SHOULD BE REFACTORED OUT
            //Notify the parent view that you're closing and they'll take care of it
            //In fact, instead of pushing to a subviews array, we should extend backbone to handle that
            //MotherView.addSubview(new ChildView())
            //On close, childView.mother.orphan()
            console.log(this.parentView.subviews);
            this.close();
        }
    });

    return FeaturePopupView;
});

