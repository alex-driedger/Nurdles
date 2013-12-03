define([
    'jquery',
    'underscore',
    'backbone',
    'models/User',
    'routers/LoginRouter',
    'routers/UsersRouter',
    'jquerycookie',
], function ($, _, Backbone, User, LoginRouter, UsersRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            window.user = $.cookie('user');
            
            // Create the collections.
            app.users = new User.Collection();

            // Start fetching the collections.
            app.fetchCollections(function () {
                app.createRouters();
            });
            
        },
        
        fetchCollections: function (callback) {
            
            // Hold onto the callback so it can be executed once the fetching count reaches 0.
            app.callback = callback;
            
            // Reset the fetching count.
            app.fetching = 0;
            
            // Fetch the collections.
            app.fetching++;
            app.users.fetch({
                success : app.finishedFetchingCollections,
                error   : app.finishedFetchingCollections,
            });
            
        },
        
        finishedFetchingCollections: function (collection, response, options) {
            
            // Decrement the fetching count.
            app.fetching--;
            
            // Execute the callback once the count reaches 0.
            if (app.fetching == 0) {
                app.callback();
            }
            
        },
        
        createRouters: function () {
            
            new LoginRouter();
                        
            new UsersRouter();
            
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});