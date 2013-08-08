define([
  'baseview',
  'text!templates/partials/static/FooterView.html'
], function(Baseview, footerTemplate){
    var FooterView = Baseview.extend({
        el: $("#footer"),

        initialize: function(args) {
        },

        render: function () {
            this.$el.html(footerTemplate);

            return this;
        }
    });

    return FooterView;
});