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