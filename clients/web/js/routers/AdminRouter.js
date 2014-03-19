define([
        'jquery',
        'underscore',
        'backbone',
        'views/AdminView',
        'authentication'
], function ( $, _, Backbone, AdminView, Authentication) {

    var AdminRouter = Backbone.Router.extend({
        
        routes: {
            'admin'  : 'index'
        },
        
        index: function () {
            //Authentication.authorize(function () {
            var adminView = new AdminView();
            $('#content').html(adminView.el);
            //}, true);
        },
                
    });
    
    return AdminRouter;
    
});