define([
        'jquery',
        'underscore',
        'backbone',
        'models/Report',
        'models/Beach',
        'views/ReportView',
        'views/IDReportView'
], function ( $, _, Backbone, ReportModel, BeachModel, ReportView, IDReportView ) {

    var ReportRouter = Backbone.Router.extend({
        
        routes: {
            'report'  : 'index',
            'report/:id' : 'retrieveOne'
        },
        
        index: function () {
            reports = new ReportModel.Collection();
            reports.fetch( {
                success: function( collection, response, options) {              
                    var reportView = new ReportView({ collection: collection });
                    $('#content').html(reportView.el);
                    initializeAutocomplete(BeachModel, "beachname", "beachName")             
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
        },

        retrieveOne: function(id) {
            console.log("HI")
            reports = new ReportModel.Collection( [], { reportID: id } );
            reports.fetch( {
                success: function( collection, response, options) {              
                    var IDreportView = new IDReportView({ collection: collection, id: id });
                    $('#content').html(IDreportView.el);             
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });

        }
                
    });
    
    return ReportRouter;
    
});