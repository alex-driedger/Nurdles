define([
  'baseview',
  'openlayersutil',
  './MapLayersDetailsView',
  'text!templates/partials/layers/SavedMapLayersView.html'
], function(Baseview, Utils, MapLayersDetailsView, savedMapLayersTemplate){
    var private = {
    };

    var SavedMapLayersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(savedMapLayersTemplate),

        events: {
        },

        render: function (firstTime) {
            this.$el.html(this.template());

            return this;
        }
    });

    return SavedMapLayersView;
});

