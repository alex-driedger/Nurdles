define([
       'jquery',
       'underscore',
       'backbone',
], function($, _, Backbone){
    var BaseCollection = Backbone.Collection.extend({
        initArgs: function(args) {
            var view = this;

            if (args) {
                _.each(_.keys(args), function(key) {
                    view[key] = args[key];
                });
            }
        },

        //We we receive collection data, it's ALWAYS going to be an array of model attributes
        //So we need to override the parsing function to accomodate this. It's weird that backbone
        //doesn't do this on it's own...
        parse: function(data) {
            for(var i = 0, len = data.length; i < len; i++) {
                var parsedModel = new this.model();

                parsedModel.set(data[i]);
                this.push(parsedModel);
            }

            return this.models;
        }
    });

    return BaseCollection;
});

