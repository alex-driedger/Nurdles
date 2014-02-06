define([
    'jquery',
    'underscore',
    'backbone',
    'models/User',
    'routers/HomepageRouter',    
    'routers/RateRouter',
    'routers/ReportRouter',
    'jquerycookie',
], function ($, _, Backbone, User, HomepageRouter, RateRouter, ReportRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            window.user = $.cookie('user');
            
            // Create the collections.
            app.users = new User.Collection();

            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new HomepageRouter();
            new RateRouter();         
            new ReportRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});