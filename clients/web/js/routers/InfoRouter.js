define([
        'jquery',
        'underscore',
        'backbone',
        'views/InfoView',
], function ( $, _, Backbone, InfoView ) {

    var InfoRouter = Backbone.Router.extend({
        
        routes: {
            'status'  : 'index'
        },
        
        index: function () {
            var infoView = new InfoView();
            $('#content').html(infoView.el);
        },
                
    });
    
    return InfoRouter;
    
});