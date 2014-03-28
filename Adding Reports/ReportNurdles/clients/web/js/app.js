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
    'routers/StatusRouter',
    'routers/SearchRouter',
    'routers/AdminRouter',
    'routers/DataRouter',
    'routers/ReportRouter',
    'routers/MultipleReportRouter',
    'jquerycookie'
], function ($, _, Backbone, SignUpRouter, LoginRouter, HomepageRouter, RateRouter, SurveyRouter, InfoRouter, StatusRouter, SearchRouter, AdminRouter, DataRouter, ReportRouter, MultipleReportRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new SignUpRouter();
            new HomepageRouter();
            new StatusRouter();
            new RateRouter();         
            new SurveyRouter();
            new InfoRouter();
            new SearchRouter();
            new AdminRouter()
            new LoginRouter();
            new DataRouter();
            new ReportRouter();
            new MultipleReportRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
