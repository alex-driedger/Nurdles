define([
  'baseview',
  'text!templates/partials/static/FooterView.html'
], function(Baseview, footerTemplate){
    var HeaderView = Baseview.extend({
        el: $("#footer"),

        initialize: function(args) {
            this.bindTo(Backbone.globalEvents, "fetchedShipCount", this.updateShipCount, this);
        },

        updateShipCount: function(count) {
            $("#shipCount").html("Visible Ships: " + count);
        },

        render: function () {
            this.$el.html(footerTemplate);

            return this;
        }
    });

    return HeaderView;
});

