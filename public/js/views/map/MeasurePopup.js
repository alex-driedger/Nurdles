define([
  'baseview',
  'text!templates/partials/map/MeasurePopup.html'
], function(Baseview, measurePopupTemplate){
    var MeasurePopupView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(measurePopupTemplate),

        render: function() {
            this.$el.html(this.template(this.model));
            $("#dialog").append(this.$el);
            $("#dialog").dialog();

            return this;
        },

        onClose: function() {

        }
    });

    return MeasurePopupView;
});


