define([
        'jquery',
        'underscore',
        'backbone',
        'models/Survey',
        'views/SurveyView',
], function ( $, _, Backbone, SurveyModel, SurveyView ) {

    var SurveyRouter = Backbone.Router.extend({
        
        routes: {
            'survey'  : 'index'
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
                
    });
    
    return SurveyRouter;
    
});