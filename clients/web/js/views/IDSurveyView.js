define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/IDsurveyTemplate.html',
    'jquerycookie',
    'models/survey'
], function ($, _, Backbone, IDsurveyTemplate, jQueryCookie, SurveyModel) {
    
    var IDSurveyView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
             'click #download' : 'sendLink'
         },
         sendLink: function() {
             button = document.getElementById("download")
             button.innerText = "Please Wait"
             button.className = button.className + " disabled"
 
             surveys = new SurveyModel.Collection( [], { surveyID: this.collection.models[0].attributes._id, username: window.user.userId, sendLink: true } );
             surveys.fetch( {
                 success: function( collection, response, options) {
 
                 button.className = button.className.replace(' disabled','')
                 button.innerText = "Send Download Link"
                 alert("Email has been sent to " + collection.models[0].attributes.email)        
                 },
                 failure: function( collection, response, options) {
                     $('#content').html("An error has occured.");                    
                 }
             });
         },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.collection = options.collection
            this.render();
        },
        
        render: function () {
            var temp = this.collection.models[0].attributes
            var items = []
            for (i in temp)
            {
                if (i != "items")
                {
                    items.push({name: i, value: temp[i]})
                } else
                {
                    for (j in temp[i])
                    {
                        items.push({name: temp[i][j].name,value: temp[i][j].value})
                    }
                }
            }
            this.$el.html(_.template(IDsurveyTemplate, {items: items}));
            return this;

        },
        
    });
    
    return IDSurveyView;
    
});
