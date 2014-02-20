define([
        'jquery',
        'underscore',
        'backbone',
        'models/Report',
        'views/ReportView',
], function ( $, _, Backbone, ReportModel, ReportView ) {

    var ReportRouter = Backbone.Router.extend({
        
        routes: {
            'report'  : 'index'
        },
        
        index: function () {
            reports = new ReportModel.Collection();
            reports.fetch( {
                success: function( collection, response, options) {              
                    var reportView = new ReportView({ collection: collection });
                    $('#content').html(reportView.el);                
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
        },
                
    });
    
    return ReportRouter;
    
});