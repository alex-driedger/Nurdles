define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var FilterOperator = Backbone.Model.extend({
    initialize: function(attributes) {
        console.log("NEW FILTER OPERATOR:", attributes);
        if (attributes)
            return this.create(attributes);
        else {
            this.type = "";
            this.operator = "";
            this.value = "";
        }
    },

    create: function(parameters) {
        this.type = parameters["type"];
        this.operator = parameters["operaror"];
        this.value = parameters["value"];

        return this;
    }
  });

  return FilterOperator;
  
});


