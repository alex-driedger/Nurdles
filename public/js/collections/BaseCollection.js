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

