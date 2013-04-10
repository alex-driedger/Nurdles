define([
  'baseview',
  'text!templates/partials/static/HeaderView.html'
], function(Baseview, headerTemplate){
    var HeaderView = Baseview.extend({

        render: function () {
            console.log(this.$el);
            this.$el.html(headerTemplate);
        }
    });

    return HeaderView;
});
