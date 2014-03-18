define([
        'jquery',
        'underscore',
        'backbone',
        'views/HomepageView',
], function ( $, _, Backbone, HomepageView ) {

    var HomepageRouter = Backbone.Router.extend({
        
        routes: {
            ''  : 'index'
        },
        
        index: function () {
            var homepageView = new HomepageView();
            $('#content').html(homepageView.el);
        },
                
    });
    
    return HomepageRouter;
    
});