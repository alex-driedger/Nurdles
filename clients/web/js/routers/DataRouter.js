define([
        'jquery',
        'underscore',
        'backbone',
        'views/DataView',
        'models/Beach',
        'models/Survey',
        'authentication'
], function ( $, _, Backbone, DataView, BeachModel, SurveyModel, Authentication) {

    var DataRouter = Backbone.Router.extend({
        
        routes: {
            'data'  : 'index',
            'data/id=:id/start=:start/end=:end' : 'getSurveys'
        },
        index: function () {
            Authentication.authorize(function () {
            var dataView = new DataView();
            $('#content').html(dataView.el);
            var d = new Date()
            date = ('0' + d.getMonth()).slice(-2) + '/' + ('0' + (d.getDate()+1)).slice(-2) + '/' + d.getFullYear();
            $("#endDate").val(date)    
            initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, false) 
            });
        },
        getSurveys: function (id, start, end) {
            surveys = new SurveyModel.Collection([], {id: id, start: start, end: end});
                surveys.fetch( {
                    success: function( collection, response, options) {
                        console.log(collection)
                        var dataView = new DataView({ collection: collection });
                        $('#content').html(dataView.el);     
                        var d = new Date()
                        date = ('0' + d.getMonth()).slice(-2) + '/' + ('0' + (d.getDate()+1)).slice(-2) + '/' + d.getFullYear();
                        $("#endDate").val(date)
                        initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, false)        
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
        }
                
    });
    
    return DataRouter;
    
});