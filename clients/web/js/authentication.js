define([
    'jquery',
    'jquerycookie',
    'underscore',
    'backbone'
], function ($, jQueryCookie, _, Backbone) {
    
    var Authentication = {
        
        authorize: function (callback, admin) {
            /*
            if (!window.user) {
                console.log("Unauthorized - Please sign in")
                return Backbone.history.navigate('login', { trigger: true });
            }
            if (admin == true)
            {
                if (window.user.admin == false)
                {
                    console.log("Unauthorized - You are not an admin")
                    return Backbone.history.navigate('login',{trigger: true});
                }
            }*/
            return callback();
        },
        
        login: function (user) {
            console.log(user)
            window.user = user;
            $.cookie('user', user);
            if (user.admin == false)
            {
                console.log("NOT AN ADMIN")
                Backbone.history.navigate('', { trigger: true });
            } else
            {
                console.log("ADMIN")
                Backbone.history.navigate('', {trigger: true});
            }
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