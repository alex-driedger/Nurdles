define([
        'jquery',
        'underscore',
        'backbone',
        'views/AdminView',
        'authentication',
        'models/Beach'
], function ( $, _, Backbone, AdminView, Authentication, BeachModel) {

    var AdminRouter = Backbone.Router.extend({
        
        routes: {
            'admin'  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
                 $('#content').html("<p style='display: block; font-size: 15%; text-align: center; line-height: 100vh; margin: 0;'>LOADING</p>");   
                beaches = new BeachModel.Collection();
                beaches.fetch( {
                    success: function( collection, response, options) {
                        var adminView = new AdminView({ collection: collection });
                        $('#content').html(adminView.el);                
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
            }, true);
        },
                
    });
    
    return AdminRouter;
    
});