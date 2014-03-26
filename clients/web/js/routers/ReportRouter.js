define([
        'jquery',
        'underscore',
        'backbone',
        'models/Report',
        'models/Beach',
        'views/ReportView',
        'views/IDReportView',
        'authentication'
], function ( $, _, Backbone, ReportModel, BeachModel, ReportView, IDReportView, Authentication ) {

    var ReportRouter = Backbone.Router.extend({
        
        routes: {
            'report'  : 'index',
            'report/:id' : 'retrieveOne'
        },
        
        index: function () {
            Authentication.authorize(function () {
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
            })
        },

        retrieveOne: function(id) {
            Authentication.authorize(function () {
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
            })
        }
                
    });
    
    return ReportRouter;
    
});