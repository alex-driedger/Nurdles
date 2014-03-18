define([
    'jquery',
    'jquerycookie',
    'underscore',
    'backbone'
], function ($, jQueryCookie, _, Backbone) {
    
    var Authentication = {
        
        authorize: function (callback) {
            if (!window.user) {
                console.log ("Unauthorized User");

                return Backbone.history.navigate('login', { trigger: true });
            }
            return callback();
        },
        
        login: function (user) {
            window.user = user;
            $.cookie('user', user);
            Backbone.history.navigate('', { trigger: true });
        },
        
        logout: function () {
            console.log( "logging out");
            window.user = null;
            $.removeCookie('user');
            Backbone.history.navigate('login', { trigger: true });
        },
        
    };
    
    return Authentication;
    
});