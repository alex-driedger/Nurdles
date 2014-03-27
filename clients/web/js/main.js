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
        moment:         '../libs/moment/moment.min',
        helpers:        'helpers',
        models:         'models',
        routers:        'routers',
        templates:      '../templates',
        views:          'views',
        api:            '../server/api'
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
        }
    },
    
});

require(['app'], function(app){
    app.start();
});
