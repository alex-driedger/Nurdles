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
    'routers/BeachRouter',
    'routers/MapRouter',
    'jquerycookie'
], function ($, _, Backbone, HomepageRouter, RateRouter, ReportRouter, MultipleReportRouter, SurveyRouter, InfoRouter, BeachRouter, MapRouter, jQueryCookie) {
    
    var app = {
        
        start: function () {
            
            app.createRouters();
        },
        
        createRouters: function () {
            // Core Homepage routers:
            new HomepageRouter();
            new MapRouter();
            new RateRouter();         
            new ReportRouter();
            new MultipleReportRouter();
            new SurveyRouter();
            new InfoRouter();
            new BeachRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
