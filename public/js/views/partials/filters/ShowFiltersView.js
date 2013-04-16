define([
   'jquery',
   'underscore',
   'backbone',
  '../../../models/Filter',
], function($, _, Backbone, Filter){
    var private = {
        operatorCounter: 0
    };

    var ShowFiltersView = Backbone.Collection.extend({
        initialize: function(args) {
        },

        model: Filter

    });

    return EditFiltersView;
});

