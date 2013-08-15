define([
  'baseview',
  'text!templates/partials/static/HeaderView.html'
], function(Baseview, headerTemplate){
    var HeaderView = Baseview.extend({
        render: function () {
            this.$el.html(headerTemplate);

            return this;
        }
    });

    return HeaderView;
});