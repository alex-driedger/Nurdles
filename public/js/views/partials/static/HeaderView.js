define([
  'baseview',
  'text!templates/partials/static/HeaderView.html'
], function(Baseview, headerTemplate){
    var HeaderView = Baseview.extend({

        events: {
            "click #searchButton":"handleSearchClick"
        },

        handleSearchClick: function(e) {
            var value = $(e.target).prev().val();

            Backbone.globalEvents.trigger("search", value);

        },

        render: function () {
            console.log(this.$el);
            this.$el.html(headerTemplate);
        }
    });

    return HeaderView;
});
