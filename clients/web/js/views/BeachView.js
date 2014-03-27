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
            'click .btn-view' : 'switchView'
        },

    switchView: function()
    {
      $("#scroll1").toggle()
      $("#scroll2").toggle()
    },
    initialize: function (options) {
      this.collection = options.collection
      this.render();
    },
    render: function () {
      var attributes = []
      // THIS IS WHERE U DO THE LAT LON LOCATION STUFF
      for (i in this.collection.models)
      {
        attributes.push(this.collection.models[i].attributes)
        switch(attributes[i].lastRating)
         {
           case 0:
             attributes[i].lastRating = "Clean"
             break
           case 1:
             attributes[i].lastRating = "Moderately Clean"
             break
           case 2:
             attributes[i].lastRating = "Dirty"
             break
           default:
             attributes[i].lastRating = "Unknown"
         }
      }
        this.$el.html( _.template( beachTemplate, {attributes: attributes}) );
        return this;
    },
      
  });
  
  return BeachView;
    
});
