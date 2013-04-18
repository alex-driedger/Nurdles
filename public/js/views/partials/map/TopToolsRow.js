define([
  'baseview',
  'text!templates/partials/map/TopToolsRow.html'
], function(Baseview, topToolsTemplate){
    var TopToolsRow = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#controlsContainer");
        },

        render: function () {
            this.$el.html(topToolsTemplate);
        }
    });

    return TopToolsRow;
});

