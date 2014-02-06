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
                return Backbone.history.navigate('rate', { trigger: true });
            }
            return callback();
        },
        
        rate: function (user) {
            console.log("RATE")
            window.user = user;
            $.cookie('user', user);
            Backbone.history.navigate('authenticated', { trigger: true });
        },
        
        logout: function () {
            console.log( "logging out");
            window.user = null;
            $.removeCookie('user');
            // Nav to login if logout is called
            Backbone.history.navigate('rate', { trigger: true });
        },
        
    };
    
    return Authentication;
    
});