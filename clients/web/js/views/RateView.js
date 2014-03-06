define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/rateTemplate.html',
  'models/Rate',
  'jquerycookie',
], function ($, _, Backbone, rateTemplate, RateModel, jQueryCookie) {
    
  var RateView = Backbone.View.extend({

    tagName   : 'div',
    className : 'rate',
    
    // redirect is used on successful create or update.
    events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'change #slider' : 'slider',
            'click .btn-submit' : 'submit'
        },

    submit: function()
    {
      if ($("#beachname").val() == "")
      {
        alert("You must enter a location")
      } else
      {
      rateModel = new RateModel.Model();
      var input = {
          beachID:$("#beachname").val(),
          rating: parseInt($("#slider").val()),
          created: new Date()
            }
      rateModel.save(input,{
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
    slider: function()
    {
      val = $("#slider").val()
      if (val == 0)
      {
        document.getElementById("IMG_RSRV").src="./images/BEACH_CLEAN.jpg"
        $("#rating").html("Clean")
      }
      else if (val == 1)
      {
        document.getElementById("IMG_RSRV").src="./images/BEACH_DIRTY.jpg"
        $("#rating").html("Dirty")
      }
      else
      {
        document.getElementById("IMG_RSRV").src="./images/BEACH_GG.jpg"
        $("#rating").html("Really Dirty")
      }
    },
    initialize: function (options) {
        this.render();
    },
    
    render: function () {
        this.$el.html( _.template( rateTemplate) );
        return this;
    },
      
  });
  
  return RateView;
    
});
