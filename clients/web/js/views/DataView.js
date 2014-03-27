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
            console.log(returnStatement)
            return returnStatement
        },
        
        render: function () {
            surveysHTML = []
            console.log(this.collection)
            if (this.collection != undefined)
            {
                console.log("hi")
                surveysHTML = this.getSurveyHTML()
            }
                this.$el.html( _.template( dataTemplate, {surveysHTML: surveysHTML} ) );

            return this;
        },
        
    });
    
    return DataView;
    
});
