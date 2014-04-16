define([
        'jquery',
        'underscore',
        'backbone',
        'views/DataView',
        'views/IDDataView',
        'models/Beach',
        'models/Survey',
        'authentication'
], function ( $, _, Backbone, DataView, IDDataView, BeachModel, SurveyModel, Authentication) {

    var DataRouter = Backbone.Router.extend({
        
        routes: {
            'data'  : 'index',
            'data/id=:id/start=:start/end=:end' : 'getSurveys',
            'data/:id' : 'displayDownload'
        },
        index: function () {
            Authentication.authorize(function () {
            var dataView = new DataView();
            $('#content').html(dataView.el);
            var d = new Date()
            date = ('0' + (d.getMonth()+1)).slice(-2) + '/' + ('0' + (d.getDate())).slice(-2) + '/' + d.getFullYear();
            $("#endDate").val(date)    
            initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, false) 
            });
        },
        getSurveys: function (id, start, end) {
            Authentication.authorize(function () {
            surveys = new SurveyModel.Collection([], {id: id, start: start, end: end});
            surveys.fetch( {
                success: function( collection, response, options) {
                    var dataView = new DataView({ collection: collection });
                    $('#content').html(dataView.el);     
                    var d = new Date()
                    date = ('0' + (d.getMonth()+1)).slice(-2) + '/' + ('0' + (d.getDate())).slice(-2) + '/' + d.getFullYear();
                    $("#endDate").val(date)
                    initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, false)        
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
        });
        }, 
        displayDownload: function(id) {
                surveys = new SurveyModel.Collection( [], { surveyID: id } );
                surveys.fetch( {
                    success: function( collection, response, options) {              
                        var IDdataView = new IDDataView({ collection: collection, id: id });
                        $('#content').html(IDdataView.el);
                        IDdataView.download();
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
        }
    });
    
    return DataRouter;
    
});