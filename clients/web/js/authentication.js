define([
    'jquery',
    'jquerycookie',
    'underscore',
    'backbone'
], function ($, jQueryCookie, _, Backbone) {
    
    var Authentication = {
        
        authorize: function (callback) {
            if (!window.user) {
                return Backbone.history.navigate('login', { trigger: true });
            }
            return callback();
        },
        
        login: function (user) {
            window.user = user;
            $.cookie('user', user);
            window.app.fetchCollections(function () {
                Backbone.history.navigate('', { trigger: true });
            });
        },
        
        logout: function () {
            window.user = null;
            $.removeCookie('user');
            Backbone.history.navigate('login', { trigger: true });
        },
        
    };
    
    return Authentication;
    
});