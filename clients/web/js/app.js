define([
    'jquery',
    'underscore',
    'backbone',
    'routers/SignUpRouter',
    'routers/LoginRouter',
    'routers/HomepageRouter',    
    'routers/RateRouter',
    'routers/ReportRouter',
    'routers/MultipleReportRouter',
    'routers/SurveyRouter',
    'routers/InfoRouter',
    'routers/BeachRouter',
    'routers/MapRouter',
    'routers/SearchRouter',
    'jquerycookie'
], function ($, _, Backbone, SignUpRouter, LoginRouter, HomepageRouter, RateRouter, ReportRouter, MultipleReportRouter, SurveyRouter, InfoRouter, BeachRouter, MapRouter, SearchRouter, jQueryCookie) {
    
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
            new ReportRouter();
            new MultipleReportRouter();
            new SurveyRouter();
            new InfoRouter();
            new BeachRouter();
            new SearchRouter();
            console.log(LoginRouter)
            console.log(SearchRouter)
            new LoginRouter();
            Backbone.history.start();

        },
        
    };
    
    window.app = app;
        
    return app;
    
});
