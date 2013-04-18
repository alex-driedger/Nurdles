define([
  'baseview',
  'text!templates/partials/static/FooterView.html'
], function(Baseview, headerTemplate){
    var HeaderView = Baseview.extend({

        el: $("#footer"),

        render: function () {
            console.log(this.$el);
            this.$el.html(headerTemplate);
        }
    });

    return HeaderView;
});

