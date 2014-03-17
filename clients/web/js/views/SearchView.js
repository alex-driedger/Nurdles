define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/search.html',
    'jquerycookie'
], function ($, _, Backbone, search, jQueryCookie) {
    
    var SearchView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(search);
            return this;
        },
        
    });
    
    return SearchView;
    
});
