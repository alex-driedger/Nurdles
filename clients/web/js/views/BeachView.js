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
           var input = []
var array = "Monora Park   Dufferin  Ontario   43.938  -80.106653  Pickering Beach   Durham  Ontario   43.827  -78.995614  Rotary Park Beach   Durham  Ontario   43.817  -79.032105  Beaverton North Beach   Durham  Ontario   44.433  -79.165101  Beaverton South Beach   Durham  Ontario   44.432  -79.166727  Thorah Centennial Park  Durham  Ontario   44.355  -79.19562  Bowmanville East Beach  Durham  Ontario   43.889  -78.663598  Bowmanville West Beach  Durham  Ontario   43.888  -78.665255  Newcastle Beach Central   Durham  Ontario   43.897  -78.576209  Lakeview Beach East   Durham  Ontario   43.865  -78.824973  Lakeview Beach West   Durham  Ontario   43.862  -78.828755  Frenchman's Bay East  Durham  Ontario   43.812  -79.078146  Frenchman's Bay West  Durham  Ontario   43.812  -79.093041  Kinsmen Beach   Durham  Ontario   44.105  -78.940707  Elgin Pond Beach  Durham  Ontario   44.105  -79.11874  Whitby Beach  Durham  Ontario   43.851  -78.926038  Port Glasgow  Elgin   Ontario   42.507  -81.611254  Port Stanley Erie Rest  Elgin   Ontario   42.662  -81.231902  Port Stanley Main Beach   Elgin   Ontario   42.659  -81.217298  Port Stanley Little Beach   Elgin   Ontario   42.663  -81.209548  Springwater Conservation Area   Elgin   Ontario   42.747  -81.03294  Port Bruce  Elgin   Ontario   42.655  -81.012818  Port Burwell Main Beach   Elgin   Ontario   42.643  -80.805908  Port Burwell Provincial Park  Elgin   Ontario   42.644  -80.82272  West Belle River  Essex   Ontario   42.297  -82.713139  Sand Point  Essex   Ontario   42.339  -82.919375  Holiday Beach   Essex   Ontario   42.031  -83.044169  Colchester Beach  Essex   Ontario   41.984  -82.934143  Cedar Beach   Essex   Ontario   42.01   -82.780879  Cedar Island Beach  Essex   Ontario   42.012  -82.779119  Lakeside Beach  Essex   Ontario   42.026  -82.742824  Seacliffe Park  Essex   Ontario   42.029  -82.605352  Point Pelee National Park - North West  Essex   Ontario   41.97   -82.536146  Hillman   Essex   Ontario   42.029  -82.486405".split("  ")
for (i in array)
{
  if (i % 5 == 0)
  {
    input.push(
    {
      beachName: array[i].toUpperCase(),
      city: array[parseInt(i)+1].toUpperCase(),
      state: array[parseInt(i)+2].toUpperCase(),
      lat: parseFloat(array[parseInt(i)+3]),
      lon: parseFloat(array[parseInt(i)+4])
    })
  }
}
for (i in input)
{
      beachModel.save(input[i],{
                success: function (res) {
                  //Backbone.history.navigate('', { trigger: true });
                    console.log(res.toJSON());
                },
                error: function (err) {
                    console.log("err")
                }
            });
}
     /* var input = {
          beachID:$("#beachname").val(),
          beachName:"WWBEACH NAME GOES HERE",
          lat: 42.746665,
          lon: -81.03294,
          city:"NOT KITCHENER",
          created: new Date(),
          lastUpdate: new Date()
            }
            console.log(input)*/
      /*beachModel.save(input,{
                success: function (res) {
                  //Backbone.history.navigate('', { trigger: true });
                    console.log(res.toJSON());
                },
                error: function (err) {
                    console.log("err")
                }
            });*/
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
