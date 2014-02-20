define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/infoTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, infoTemplate, jQueryCookie) {
    
    var InfoView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(infoTemplate);
            return this;
        },
        
    });
    
    return InfoView;
    
});
