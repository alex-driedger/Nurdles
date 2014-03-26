define([
    'jquery',
    'underscore',
    'backbone',
    'routers/SignUpRouter',
    'routers/LoginRouter',
    'routers/HomepageRouter',    
    'routers/RateRouter',
    'routers/SurveyRouter',
    'routers/InfoRouter',
    'routers/BeachRouter',
    'routers/MapRouter',
    'routers/SearchRouter',
    'routers/AdminRouter',
    'routers/DataRouter',
    'jquerycookie'
], function ($, _, Backbone, SignUpRouter, LoginRouter, HomepageRouter, RateRouter, SurveyRouter, InfoRouter, BeachRouter, MapRouter, SearchRouter, AdminRouter, DataRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new SignUpRouter();
            new HomepageRouter();
            new MapRouter();
            new RateRouter();         
            new SurveyRouter();
            new InfoRouter();
            new BeachRouter();
            new SearchRouter();
            new AdminRouter()
            new LoginRouter();
            new DataRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
