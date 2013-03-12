// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/pages/HomeView',
  'views/partials/HeaderView',
  'views/partials/FooterView'
], function($, _, Backbone, HomeView, HeaderView, FooterView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
    },

    initialize: function() {
        console.log("TEST");
        this.mainEl = $("#main");
        var headerView = new HeaderView({el: this.mainEl});
        headerView.render();
        var footerView = new FooterView();
        footerView.render();
    },

    index: function() {
        var homeView = new HomeView({el: this.mainEl});
        AppView.showView(homeView, this.mainEl);
    }
  });

  var AppView = {
      currentView: null,
      previousView: null,
      showView: function(view, mainEl) {
          if (this.currentView)
              this.previousView = this.currentView;

          this.currentView = view;
          //This uses the el set in the view when we initialize it. AppView is here only to swap entire views.
          this.currentView.render();

          if (this.previousView){
              this.previousView.close();
          }
      }
  }

  var initialize = function(){
    var router = new AppRouter;
    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };
});
