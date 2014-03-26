define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/dataTemplate.html',
    'jquerycookie',
    'authentication',
    'models/survey'
], function ($, _, Backbone, dataTemplate, jQueryCookie, authentication, SurveyModel) {
    
    var DataView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
            'click #surveySearch': 'getSurveys',
        },
        getSurveys: function (options) {
            if (new Date($("#startDate").val()) == "Invalid Date" || $("#startDate").val().length != 10 || new Date($("#endDate").val()) == "Invalid Date" || $("#endDate").val().length != 10 )
            {
                alert("Please select valid dates")
            } else if ($("#beachname")[0].beachID != undefined)
            {
            window.location.href = "#data/id="+$("#beachname")[0].beachID+"/start="+$("#startDate").val().replace(/\//g, '')+"/end="+$("#endDate").val().replace(/\//g, '')
            } else
            {
                alert("Please select a beach")
            }
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(dataTemplate);
            return this;
        },
        
    });
    
    return DataView;
    
});
