define([
        'jquery',
        'underscore',
        'backbone',
        'views/MapView',
        'models/Beach',
], function ( $, _, Backbone, MapView, BeachModel ) {

    var MapRouter = Backbone.Router.extend({
        
        routes: {
            'map'  : 'index'
        },
        
        index: function () {
            $('#content').html("LOADING");   
            navigator.geolocation.getCurrentPosition(function (position)
            {
            beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude});
            beaches.fetch( {
                success: function( collection, response, options) {              
                    var mapView = new MapView({ collection: collection, lat: position.coords.latitude,lon: position.coords.longitude });
                    $('#content').html(mapView.el);
                    mapView.renderMap(); 
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
          })
        },
                
    });
    
    return MapRouter;
    
});