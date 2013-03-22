define([
  'jquery',
  'underscore',
  'backbone',
  '../models/FilterOperator',
], function($, _, Backbone, FilterOperator){
    var FilterOperatorsCollection = Backbone.Collection.extend({
        model: FilterOperator 
    });

    return FilterOperatorsCollection;
});
