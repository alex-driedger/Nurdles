define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/homepage.html',
    'jquerycookie',
    'authentication',
], function ($, _, Backbone, homepage, jQueryCookie, Authentication) {
    
    var HomepageView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(homepage);
            return this;
        },
        
    });
    
    return HomepageView;
    
});
