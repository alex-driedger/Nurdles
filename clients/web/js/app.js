define([
    'jquery',
    'underscore',
    'backbone',
    'routers/HomepageRouter',    
    'routers/RateRouter',
    'routers/ReportRouter',
    'routers/MultipleReportRouter',
    'routers/SurveyRouter',
    'routers/InfoRouter',
    'jquerycookie'
], function ($, _, Backbone, HomepageRouter, RateRouter, ReportRouter, MultipleReportRouter, SurveyRouter, InfoRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new HomepageRouter();
            new RateRouter();         
            new ReportRouter();
            new MultipleReportRouter();
            new SurveyRouter();
            new InfoRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
