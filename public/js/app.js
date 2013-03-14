// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'bootstrap',
  'router'
], function($, _, Backbone, Bootstrap, Router){
  var initialize = function(){
    Router.initialize();
  };

  Backbone.View.prototype.close = function(){
      this.$el.empty();
      this.unbind();
      if (this.subviews)
          _.each(this.subviews, function(subview){
              if (subview.close){
                  subview.close();
              }
          });
  };

  return { 
    initialize: initialize
  };
});
