[// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
], function($, _, Backbone, Router){
  var initialize = function(){
    Backbone.globalEvents = _.extend({}, Backbone.Events);
    Router.initialize();
  };

  return { 
    initialize: initialize
  };
});
