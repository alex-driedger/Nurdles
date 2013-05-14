define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Layer = Backbone.Model.extend({
        idAttribute: "_id",

        initialize: function(attributes) {
        }
    });

    return Layer;

});


