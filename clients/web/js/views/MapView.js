define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/mapTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, mapTemplate, jQueryCookie) {
    
    var MapView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            
            this.render();
        },
        
        render: function () {
            this.$el.html(mapTemplate);
            return this;
        },
        
    });
    
    return MapView;
    
});
