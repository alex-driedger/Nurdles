define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/rateTemplate.html',
  'models/Rate',
  'models/Beach',
  'jquerycookie',
], function ($, _, Backbone, rateTemplate, RateModel, BeachModel, jQueryCookie) {
    
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
      var checkBox = document.getElementById("ucl").checked
      if ($("#beachname")[0].beachName != $("#beachname").val().toUpperCase() && !checkBox)
      {
        alert("You must select a location from the dropdown list")
      } else
      {
      rateModel = new RateModel.Model();
      var input = {
          beachID:$("#beachname")[0].beachID,
          rating: parseInt($("#slider").val()),
          created: new Date()
            }
            if (checkBox)
            {
            navigator.geolocation.getCurrentPosition(function (position)
            {
            beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
            beaches.fetch( {
                success: function( collection, response, options) {
                    input.beachID = collection.models[0].attributes._id       
                    rateModel.save(input,{
                    success: function (res) {
                      //Backbone.history.navigate('', { trigger: true });
                        console.log(res.toJSON());
                    },
                    error: function (err) {
                        console.log("err")
                    }
                });
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
          })
            } else
            {
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
