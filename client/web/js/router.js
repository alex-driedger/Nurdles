// Filename: router.js
define([
       'jquery',
       'underscore',
       'backbone',
       'views/pages/HomeView',
       'views/pages/SignInView',
       'views/partials/static/HeaderView',
       'views/partials/static/FooterView'
], function($, _, Backbone, HomeView, SignInView, HeaderView, FooterView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'signin',
            'signin': 'signin',
            'home': 'home'
        },

        initialize: function() {
            this.mainEl = $("#content");
            var headerView = new HeaderView({el: $("#header")});
            var footerView = new FooterView();

            headerView.render();
            footerView.render();
        },

        signin: function (id) {
            var signinView = new SignInView({el: this.mainEl, router: this});
            AppView.showView(signinView);
        },

        home: function() {
            var homeView = new HomeView({el: this.mainEl});
            this.checkAuth(function(authenticated) {
                if (authenticated)
                    AppView.showView(homeView);
            });
        },

        checkAuth: function(callback) {
            var that = this;
            $.ajax({
                type: "GET",
                url: "/api/user/checkAuth",
                cache: false,
                success: function(user) {
                    window.user = user;
                    callback(true);
                },
                error: function(err) { 
                    alert("You are not signed in!");
                    callback(false);
                    that.navigate('', true);
                }
            });
        }
    });

    var AppView = {
        currentView: null,
        previousView: null,
        showView: function(view) {
            if (this.currentView)
                this.previousView = this.currentView;

            this.currentView = view;

            if (this.previousView){
                this.previousView.close();
            }
            //This uses the el set in the view when we initialize it. AppView is here only to swap entire views.
            this.currentView.render();
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
