define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    
    var User = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: '/api/user',
        defaults: function () {
            return {
                username : '',
                password : ''
            };
        },
    });

    var UserCollection = Backbone.Collection.extend({
        url: '/api/user',
        model: User,
        comparator: 'username',
        initialize: function( models, options ) {
            if (options != undefined)
            {
                this.url = "api/user/" + options.username + "/" + options.admin
            }
        }
    });
    
    return {
        Model: User,
        Collection: UserCollection
    };

});
