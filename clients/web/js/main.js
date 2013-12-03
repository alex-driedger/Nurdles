// Based on code from Thomas Davis (backbonetutorials.com)
require.config({
        
    noGlobal: true,
    
    paths: {
        text:           '../libs/text/text',
        jquery:         '../libs/jquery/jquery-2.0.3',
        jquerycookie:   '../libs/jquery-cookie/jquery.cookie',
        jqueryui:       '../libs/jquery-ui/ui/jquery-ui',
        underscore:     '../libs/underscore/underscore',
        backbone:       '../libs/backbone/backbone',
        datetimepicker: '../libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
        moment:         '../libs/moment/moment.min',
        
        authentication: 'authentication',
        helpers:        'helpers',
        models:         'models',
        routers:        'routers',
        templates:      '../templates',
        views:          'views',
    },

    // Configure loader for modules that do not support AMD.
    shim: {
        underscore: {
            deps: ['jquery'],
            exports: "_"
        },

        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        
        datetimepicker: {
            deps: ['jquery']
        },
    },
    
});

require(['app'], function(app){
    app.start();
});
