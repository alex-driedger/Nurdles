define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/homepage.html',
    'jquerycookie',
    'authentication'
], function ($, _, Backbone, homepage, jQueryCookie, authentication) {
    
    var HomepageView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
            'click #logout' : 'logout'
        },
        logout: function () {
            authentication.logout()
        },
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
