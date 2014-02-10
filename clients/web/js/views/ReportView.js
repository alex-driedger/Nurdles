define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/report.html',
    'jquerycookie',
    'authentication',
], function ($, _, Backbone, report, jQueryCookie, Authentication) {
    
    var ReportView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .login-button' : 'report',
        },
        report: function(event)
        {
            console.log($('#item').val())
            console.log($('#description').val())
            console.log($('#comments').val())
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(report);
            return this;
        },
        
    });
    
    return ReportView;
    
});
