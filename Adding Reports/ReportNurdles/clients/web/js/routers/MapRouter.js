define([
        'jquery',
        'underscore',
        'backbone',
        'views/MapView',
        'models/Beach',
        'authentication'
], function ( $, _, Backbone, MapView, BeachModel, Authentication ) {

    var MapRouter = Backbone.Router.extend({
        
        routes: {
            'map'  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
                $('#content').html("<p style='display: block; font-size: 3em; text-align: center; line-height: 100vh;'>LOADING</p>");   
                navigator.geolocation.getCurrentPosition(function (position)
                {
                beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 5});
                beaches.fetch( {
                    success: function( collection, response, options) {              
                        var mapView = new MapView({ collection: collection, lat: position.coords.latitude,lon: position.coords.longitude});
                        $('#content').html(mapView.el);
                        mapView.renderMap(); 
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              })
            })
        },
                
    });
    
    return MapRouter;
    
});