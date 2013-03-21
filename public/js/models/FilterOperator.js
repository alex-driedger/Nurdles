define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var FilterOperator = Backbone.Model.extend({
    initialize: function(attributes) {
        if (attributes)
            return create(attributes);
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


