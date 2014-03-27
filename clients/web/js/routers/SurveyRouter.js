define([
        'jquery',
        'underscore',
        'backbone',
        'models/Survey',
        'models/BeachSurvey',
        'models/Beach',
        'views/SurveyView',
        'views/IDSurveyView',
        'authentication'
], function ( $, _, Backbone, SurveyModel, BeachSurveyModel, BeachModel, SurveyView, IDSurveyView, Authentication ) {

    var SurveyRouter = Backbone.Router.extend({
        
        routes: {
            'survey'  : 'index',
            'survey/:id' : 'retrieveOne'
        },
        
        index: function () {
            Authentication.authorize(function () {         
                        var surveyView = new SurveyView();
                        $('#content').html(surveyView.el);
                        initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, false, true) 
                        initializeAutocomplete(BeachModel, "city", "city", Infinity, false, true)   
                        initializeAutocomplete(BeachModel, "state", "state", Infinity, false,  true)   
                        initializeAutocomplete(BeachModel, "country", "country", Infinity, false, true)  
            })
        },

        retrieveOne: function(id) {
            Authentication.authorize(function () {
                surveys = new SurveyModel.Collection( [], { surveyID: id } );
                surveys.fetch( {
                    success: function( collection, response, options) {              
                        var IDsurveyView = new IDSurveyView({ collection: collection, id: id });
                        $('#content').html(IDsurveyView.el);             
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
            })
        }
                
    });
    
    return SurveyRouter;
    
});