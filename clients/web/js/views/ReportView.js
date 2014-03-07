define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/reportTemplate.html',
  'models/Report',
  'jquerycookie',
], function ($, _, Backbone, reportTemplate, ReportModel, jQueryCookie) {
    
  var ReportView = Backbone.View.extend({

    tagName   : 'div',
    className : 'report',
    
    // redirect is used on successful create or update.
    events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-submit' : 'submit'
        },

    submit: function()
    {
      if ($("#item").val() == "")
      {
        alert("You must enter an item name")
      } else if ($("#beachname")[0].beachID == undefined || $("#beachname")[0].beachName != $("#beachname").val().toUpperCase())
      {
        alert("You must select a location from the dropdown list")
      } else 
      {
        reportModel = new ReportModel.Model();
        var input = {
            items:[{name: $("#item").val(), value: 1}],
            beachID:$("#beachname")[0].id,
            comments: $("#comments").val(),
            created: new Date()
              }
        reportModel.save(input,{
                  success: function (res) {
                    //Backbone.history.navigate('', { trigger: true });
                      console.log(res.toJSON());
                  },
                  error: function (err) {
                      console.log("err")
                  }
              });
      }
    },
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        this.$el.html( _.template(reportTemplate) );
        return this;
    },
      
  });
  
  return ReportView;
    
});
