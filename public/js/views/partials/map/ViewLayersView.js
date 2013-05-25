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

        events: {},

        render: function() {
            this.$el.html(this.template({layers: this.layers}));
            
            return this;
        }
    });

    return ViewLayersView;
});

