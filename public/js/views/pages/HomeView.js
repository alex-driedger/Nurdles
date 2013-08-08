define([
  'baseview',
  'text!templates/pages/HomeView.html'
], function(Baseview, homeTemplate){

  var HomeView = Baseview.extend({
    initialize: function() {
        this.subviews = [];
        this.showLoader();

        this.bindTo(Backbone.globalEvents, "showLoader", this.showLoader, this);
        this.bindTo(Backbone.globalEvents, "hideLoader", this.hideLoader, this);
    },

    events: {
    },

    showLoader: function(e) {
        $("#loader").removeClass("hide");
    },

    hideLoader: function(e) {
        $("#loader").addClass("hide");
    },

    render: function(){
      this.$el.append(homeTemplate);
    }

  });

  return HomeView;
});