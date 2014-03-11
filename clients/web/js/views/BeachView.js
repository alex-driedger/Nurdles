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
                                         //************
      beachModel = new BeachModel.Model();
      beachModel.save({
                success: function (res) {
                  //Backbone.history.navigate('', { trigger: true });
                    console.log(res.toJSON());
                },
                error: function (err, err2, err3) {
                    console.log(err)
                }
            });
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
      }
      console.log(this.collection.models)
        this.$el.html( _.template( beachTemplate, {attributes: attributes}) );
        return this;
    },
      
  });
  
  return BeachView;
    
});
