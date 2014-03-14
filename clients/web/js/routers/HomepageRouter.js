define([
        'jquery',
        'underscore',
        'backbone',
        'views/HomepageView',
        'authentication'
], function ( $, _, Backbone, HomepageView, Authentication) {

    var HomepageRouter = Backbone.Router.extend({
        
        routes: {
            ''  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {

                var homepageView = new HomepageView();({ 
                    userId        : window.user,
                });

            $('#content').html(homepageView.el);
            });
        },
                
    });
    
    return HomepageRouter;
    
});