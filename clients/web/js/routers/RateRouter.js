define([
        'jquery',
        'underscore',
        'backbone',
        'models/Rate',
        'models/Beach',
        'views/RateView',
], function ( $, _, Backbone, RateModel, BeachModel, RateView ) {

    var RateRouter = Backbone.Router.extend({
        
        routes: {
            'rate'  : 'index'
        },
        
        index: function () {
            //GET data
            rates = new RateModel.Collection();
            rates.fetch( {
                success: function( collection, response, options) {              
                    var rateView = new RateView({ collection: collection });
                    $('#content').html(rateView.el);
                    initializeAutocomplete(BeachModel, "beachname", "beachName")
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
       },
                
    });
    
    return RateRouter;
    
});