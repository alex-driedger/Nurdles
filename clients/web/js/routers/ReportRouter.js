define([
        'jquery',
        'underscore',
        'backbone',
        'views/ReportView',
], function ( $, _, Backbone, ReportView ) {

    var ReportRouter = Backbone.Router.extend({
        
        routes: {
            'report'  : 'index'
        },
        
        index: function () {
            var reportView = new ReportView();
            $('#content').html(reportView.el);
        },
                
    });
    
    return ReportRouter;
    
});