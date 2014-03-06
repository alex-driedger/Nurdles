define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/beachTemplate.html',
  'text!templates/mapTemplate.html',
  'models/Beach',
  'jquerycookie',
], function ($, _, Backbone, beachTemplate, mapTemplate, BeachModel, jQueryCookie) {
    
  var BeachView = Backbone.View.extend({

    tagName   : 'div',
    className : 'beach',
    
    // redirect is used on successful create or update.
    events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-submit' : 'submit',
            'click .btn-view' : 'switchView'
        },

    switchView: function()
    {
      $("#scroll1").toggle()
      $("#scroll2").toggle()
    },
    submit: function()
    {
      beachModel = new BeachModel.Model();

      var input = {
          beachID:$("#beachname").val(),
          beachName:"WWBEACH NAME GOES HERE",
          lat: 42.746665,
          lon: -81.03294,
          city:"NOT KITCHENER",
          created: new Date(),
          lastUpdate: new Date()
            }
      beachModel.save(input,{
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
      this.collection = options.collection
      this.render();
    },
    initializeAutocomplete: function () {
          $( "#tags" ).autocomplete({
          focus: function (event, ui) {
            $("#tags").val(ui.item.label)
            return false;
          },
          source: function(request, callback) {
            beaches = new BeachModel.Collection([],{data: $("#tags").val()});
            beaches.fetch( {
                success: function( collection, response, options) {
                var availableTags = [];
                for (i in collection.models)
                {
                    availableTags.push({label: collection.models[i].attributes.beachName, desc: "City: "+collection.models[i].attributes.city})
                }
                callback(availableTags)
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
          } 
        })
        // Now change the ui-autocomplete data by calling renderItem on it. If you return none
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
          // I have no idea how appendTo(ul) works. (I'm assuming every item in dropdown is a ul)
          return $( "<li>" ).append( "<a><span style='color: #3AF; text-transform: capitalize;'>" + item.label + "</span><br><span style='font-size: 0.75em'>" + item.desc + "</span></a>" ).appendTo( ul );
          };
    },
    render: function () {
      var attributes = []
      // THIS IS WHERE U DO THE LAT LON LOCATION STUFF
      for (i in this.collection.models)
      {
        attributes.push(this.collection.models[i].attributes)
      }
        this.$el.html( _.template( beachTemplate, {attributes: attributes}) );
        return this;
    },
      
  });
  
  return BeachView;
    
});
