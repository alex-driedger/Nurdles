// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'openlayersutil'
], function($, _, Backbone, Router, Util){
  var initialize = function(){
    Backbone.globalEvents = _.extend({}, Backbone.Events);
    Util.setUpUtilFunctions();
    Router.initialize();
  };

  return { 
    initialize: initialize
  };
});
