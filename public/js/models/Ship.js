define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Ship = Backbone.Model.extend({
        idAttribute: "_id",

    defaults: function () {
      return {
        title: "",
        text: "*Edit your note!*",
        createdAt: new Date()
      };

    });

    return Ship;

});
});
