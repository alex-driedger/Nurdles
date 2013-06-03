define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Ship = Backbone.Model.extend({
        idAttribute: "_id",

    });

    return Ship;

});

