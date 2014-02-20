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
      console.log($("#item").val());
      console.log($("#description").val());
      console.log($("#comments").val());
      reportModel = new ReportModel.Model();
      var d = new Date();
      var input = {
          items:[$("#item").val()],
          description:$("#description").val(),
          comments: $("#comments").val(),
          created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
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
    },
    initialize: function (options) {
        this.collection = options.collection;
        this.render();
    },
    
    render: function () {
        this.$el.html( _.template( reportTemplate, { reports:this.collection } ) );
        return this;
    },
      
  });
  
  return ReportView;
    
});
