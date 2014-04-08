define([
        'jquery',
        'underscore',
        'backbone',
        'models/Beach',
        'views/StatusView',
        'authentication'
], function ( $, _, Backbone, BeachModel, StatusView, Authentication) {

    var StatusRouter = Backbone.Router.extend({
        
        routes: {
            'status'  : 'index',
        },
        
        index: function () {
            Authentication.authorize(function () {
                 $('#content').html("<p style='display: block; font-size: 15%; text-align: center; line-height: 100vh; margin: 0;'>LOADING</p>");   
               // navigator.geolocation.getCurrentPosition(function (position)
               // {
                beaches = new BeachModel.Collection([], {lat: 0,lon: 0, amount: Infinity});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        var statusView = new StatusView({ collection: collection, lat: 0, lon: 0});
                        $('#content').html(statusView.el);                
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              //}, function(err)
              //{
              //  alert("Please enable geolocation")
             // })
            })
        },
                
    });
    
    return StatusRouter;
    
});