define([
        'jquery',
        'underscore',
        'backbone',
        'models/Report',
        'models/Beach',
        'views/MultipleReportView',
        'authentication'
], function ( $, _, Backbone, ReportModel, BeachModel, MultipleReportView, Authentication ) {

    var MultipleReportRouter = Backbone.Router.extend({
        
        routes: {
            'multipleReport'  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
                reports = new ReportModel.Collection();
                reports.fetch( {
                    success: function( collection, response, options) {
                        var multipleReportView = new MultipleReportView({ collection: collection });
                        $('#content').html(multipleReportView.el); 
                        initializeAutocomplete(BeachModel, "beachname", "beachName")          
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
            })
        },
                
    });
    
    return MultipleReportRouter;
    
});