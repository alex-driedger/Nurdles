define([
        'jquery',
        'underscore',
        'backbone',
        'models/Report',
        'views/MultipleReportView',
], function ( $, _, Backbone, ReportModel, MultipleReportView ) {

    var MultipleReportRouter = Backbone.Router.extend({
        
        routes: {
            'multipleReport'  : 'index'
        },
        
        index: function () {
            reports = new ReportModel.Collection();
            reports.fetch( {
                success: function( collection, response, options) {              
                    var multipleReportView = new MultipleReportView({ collection: collection });
                    $('#content').html(multipleReportView.el);                
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
        },
                
    });
    
    return MultipleReportRouter;
    
});