define([
        'jquery',
        'underscore',
        'backbone',
        'views/LoginView',
        'authentication',
], function ($, _, Backbone, LoginView, Authentication) {
    
    var LoginRouter = Backbone.Router.extend({
        
        routes: {
            'login'  : 'login',
            'logout' : 'logout'
        },
        
        login: function () {
            var loginView = new LoginView();
            $('#content').html(loginView.el);
        },
        
        logout: function () {
            Authentication.logout();
        },
                
    });
    
    return LoginRouter;
    
});
