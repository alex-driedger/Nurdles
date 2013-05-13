define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Layer = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            styles: [],
            url: ""
        },

        initialize: function(attributes) {
        }
    });

    return Layer;

});


