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
            'click .btn-submit' : 'submit',
            'click #checkbox' : 'getNearestBeach'
        },
    getNearestBeach: function(events)
    {
            var beachname = document.getElementById('beachname')
            var checkbox = document.getElementById("checkbox")
            var checkboxVisual = document.getElementById("checkboxVisual")
            var submit = document.getElementById("submit")
            if (checkbox.checked)
            {
              checkboxVisual.style.backgroundColor = "gray";
                beachname.readOnly = true;
                checkbox.disabled = true;
                submit.disabled = true;
                submit.innerText = "Please Wait"
                navigator.geolocation.getCurrentPosition(function (position)
                {
                beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        checkbox.disabled = false;
                        submit.disabled = false;
                        submit.innerText = "Submit"
                        item = collection.models[0].attributes
                        $( "#beachname")[0].beachName = item.beachName
                        $( "#beachname")[0].beachID = item._id
                        $( "#beachname").val(item.beachName);
                        $( "#city").val(item.city);
                        $( "#state").val(item.state);
                        $("#country").val(item.country);
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              })
            } else
            {
                                    checkboxVisual.style.backgroundColor = "white";
                    beachname.readOnly = false;
                    beachname.value = ""
            }
    },
    
    submit: function()
    {
      var checkbox = document.getElementById("checkbox").checked
      if ($("#beachname")[0].beachName != $("#beachname").val().toUpperCase() && !checkbox)
      {
        alert("You must select a location from the dropdown list")
      } else
      {
      rateModel = new RateModel.Model();
      var input = {
          beachID:$("#beachname")[0].beachID,
          rating: parseInt($("#slider").val()/1000),
          created: new Date()
            }
            if (checkbox)
            {
            navigator.geolocation.getCurrentPosition(function (position)
            {
            beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
            beaches.fetch( {
                success: function( collection, response, options) {
                    input.beachID = collection.models[0].attributes._id
                    rateModel.save(input,{
                    success: function (res) {
                        alert("Your rating has been submitted")
                        Backbone.history.navigate('#', { trigger: true });
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
                      alert("Your report has been submitted")
                      Backbone.history.navigate('', { trigger: true });
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
      val = parseInt($("#slider").val()/1000)
      if (val == 0)
      {
        document.getElementById("IMG").src="./images/BEACH_CLEAN.jpg"
        $("#rating").html("Clean")
      }
      else if (val == 1)
      {
        document.getElementById("IMG").src="./images/BEACH_DIRTY.jpg"
        $("#rating").html("Moderately Clean")
      }
      else
      {
        document.getElementById("IMG").src="./images/BEACH_GG.jpg"
        $("#rating").html("Dirty")
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
