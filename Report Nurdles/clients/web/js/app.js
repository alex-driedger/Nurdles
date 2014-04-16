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
    'routers/MultipleReportRouter',
    'routers/ReportRouter',
    'routers/AdminRouter',
    'routers/DataRouter',
    'jquerycookie'
], function ($, _, Backbone, SignUpRouter, LoginRouter, HomepageRouter, RateRouter, SurveyRouter, InfoRouter, StatusRouter, SearchRouter, MultipleReportRouter, ReportRouter, AdminRouter, DataRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new SignUpRouter();
            new HomepageRouter();
            new RateRouter();         
            new SurveyRouter();
            new InfoRouter();
            new StatusRouter();
            new SearchRouter();
            new AdminRouter()
            new LoginRouter();
            new DataRouter();
            new MultipleReportRouter();
            new ReportRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
