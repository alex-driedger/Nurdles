define([
        'jquery',
        'underscore',
        'backbone',
        'models/Survey',
        'models/BeachSurvey',
        'views/SurveyView',
        'views/IDSurveyView'
], function ( $, _, Backbone, SurveyModel, BeachSurveyModel, SurveyView, IDSurveyView ) {

    var SurveyRouter = Backbone.Router.extend({
        
        routes: {
            'survey'  : 'index',
            'survey/:id' : 'retrieveOne'
        },
        
        index: function () {
            surveys = new SurveyModel.Collection();
            surveys.fetch( {
                success: function( collection, response, options) {              
                    var surveyView = new SurveyView({ collection: collection });
                    $('#content').html(surveyView.el);                
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
        },

        retrieveOne: function(id) {
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

        }
                
    });
    
    return SurveyRouter;
    
});