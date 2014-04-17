define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/dataTemplate.html',
    'jquerycookie',
    'authentication',
    'models/Survey'
], function ($, _, Backbone, dataTemplate, jQueryCookie, authentication, SurveyModel) {
    
    var DataView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
            'click #surveySearch': 'getSurveys',
        },
        getSurveys: function (options) {
            if ($("#beachname")[0].beachID != undefined)
            {
            window.location.href = "#data/id="+$("#beachname")[0].beachID+"/start="+$("#startDate").val().replace(/\//g, '')+"/end="+$("#endDate").val().replace(/\//g, '')
            } else
            {
                alert("Please select a beach")
            }
        },
        initialize: function (options) {
            if (options != undefined)
            {
                this.collection = options.collection
            }
            this.render();
        },
        getSurveyHTML: function() {
            returnStatement = [];
            console.log(this.collection.models)
            var models = this.collection.models
            for (i in models)
            {
                var date = new Date(models[i].attributes.created)
                returnStatement.push({html: ("Survey Date : " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " at " + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2)), id: models[i].attributes._id})
            }
            return returnStatement
        },
        
        render: function () {
            surveysHTML = []
            if (this.collection != undefined)
            {
                if (this.collection.models.length != 0)
                {
                    surveysHTML = this.getSurveyHTML()
                } else
                {
                    alert("No surveys were found")
                }
            }
                this.$el.html( _.template( dataTemplate, {surveysHTML: surveysHTML} ) );

            return this;
        },
        
    });
    
    return DataView;
    
});
