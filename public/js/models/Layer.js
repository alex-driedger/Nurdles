define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
    var Layer = Backbone.Model.extend({
        idAttribute: "_id",

        initialize: function(attributes) {
        },

        update: function(success, fail, context) {
            this.save(null, { 
                url: "/api/layers/" + this.get("_id") + "/update",
                success: function(data) {
                    if (success) success(data, context);
                },
                fail: function(err) {
                    if (fail) fail(err, context);
                }
            });
        }
    });

    return Layer;

});


