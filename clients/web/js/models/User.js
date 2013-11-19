define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    
    var User = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: 'users',
        defaults: function () {
            return {
                username : '',
                password : ''
            };
        },
    });

    var UserCollection = Backbone.Collection.extend({
        url: 'users',
        // Define the model used when creating instances from objects and arrays.
        model: User,
        // Define the sort order used when returning collections.
        comparator: 'username'
    });
    
    return {
        Model: User,
        Collection: UserCollection
    };

});
