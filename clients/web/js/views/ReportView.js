define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/reportTemplate.html',
  'models/Report',
  'models/Beach',
  'jquerycookie',
], function ($, _, Backbone, reportTemplate, ReportModel, BeachModel, jQueryCookie) {
    
  var ReportView = Backbone.View.extend({

    tagName   : 'div',
    className : 'report',
    
    // redirect is used on successful create or update.
    events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-submit' : 'submit',
            'change #inputFileToLoad' : 'image'
        },
    image: function()
    {
  var filesSelected = document.getElementById("inputFileToLoad").files;
  if (filesSelected.length > 0)
  {
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
      document.getElementById("image").src = fileLoadedEvent.target.result
    };
    fileReader.readAsDataURL(fileToLoad);
  }
    },
    submit: function()
    {
      console.log(document.getElementById("image").src)
      var checkBox = document.getElementById("cl").checked
      if ($("#item").val() == "")
      {
        alert("You must enter an item name")
      } else if ($("#beachname")[0].beachName != $("#beachname").val().toUpperCase() && !checkBox)
      {
        alert("You must select a location from the dropdown list")
      } else 
      {
        reportModel = new ReportModel.Model();
        var input = {
            items:[{name: $("#item").val(), value: 1}],
            beachID:$("#beachname")[0].beachID,
            comments: $("#comments").val(),
            image: document.getElementById("image").src,
            created: new Date()
              }
              $("#comments").val(document.getElementById("image").src)
              console.log($("#comments").val())
              console.log(input)
            if (checkBox)
            {
            navigator.geolocation.getCurrentPosition(function (position)
            {
                beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        input.beachID = collection.models[0].attributes._id       
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
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              })
            } else
            {
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
