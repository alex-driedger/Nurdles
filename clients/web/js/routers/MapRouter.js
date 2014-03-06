define([
        'jquery',
        'underscore',
        'backbone',
        'views/MapView',
], function ( $, _, Backbone, MapView ) {

    var MapRouter = Backbone.Router.extend({
        
        routes: {
            'map'  : 'index'
        },
        
        index: function () {
            var mapView = new MapView();
            $('#content').html(mapView.el);
        },
                
    });
    
    return MapRouter;
    
});