define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/search.html',
    'jquerycookie',
    'models/Beach',
], function ($, _, Backbone, search, jQueryCookie, BeachModel) {
    
    var SearchView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events:  {
            'click #searchByCoord' : 'searchByLocation'
        },
        searchByLocation: function (options) {
                beaches = new BeachModel.Collection([], {lat: $('#lat').val(),lon: $('#lon').val(), amount: 1});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        Backbone.history.navigate("#info/" + collection.models[0].attributes._id, { trigger: true });
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });

        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            var attributes = []
            if (this.collection != undefined)
            {
                // THIS IS WHERE U DO THE LAT LON LOCATION STUFF
                for (i in this.collection.models)
                {
                    attributes.push(this.collection.models[i].attributes)
                }
            }
            this.$el.html(_.template( search, {attributes: attributes}) );
            return this;
        },
        
    });
    
    return SearchView;
    
});
