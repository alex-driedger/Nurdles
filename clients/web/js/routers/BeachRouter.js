define([
        'jquery',
        'underscore',
        'backbone',
        'models/Beach',
        'views/BeachView',
], function ( $, _, Backbone, BeachModel, BeachView) {

    var BeachRouter = Backbone.Router.extend({
        
        routes: {
            'status'  : 'index'
        },
        
        index: function () {
            $('#content').html("<p style='display: block; font-size: 3em; text-align: center; line-height: 100vh;'>LOADING</p>");   
            navigator.geolocation.getCurrentPosition(function (position)
            {
            beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 5});
            beaches.fetch( {
                success: function( collection, response, options) {
                console.log(collection)     
                    var beachView = new BeachView({ collection: collection });
                    $('#content').html(beachView.el);                
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
          })
        },
                
    });
    
    return BeachRouter;
    
});