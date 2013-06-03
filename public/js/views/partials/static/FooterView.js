define([
  'baseview',
  'text!templates/partials/static/FooterView.html'
], function(Baseview, headerTemplate){
    var HeaderView = Baseview.extend({

        el: $("#footer"),

        render: function () {
            this.$el.html(headerTemplate);

            return this;
        }
    });

    return HeaderView;
});

