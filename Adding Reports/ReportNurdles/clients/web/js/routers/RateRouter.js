define([
        'jquery',
        'underscore',
        'backbone',
        'models/Rate',
        'models/Beach',
        'views/RateView',
        'authentication'
], function ( $, _, Backbone, RateModel, BeachModel, RateView, Authentication ) {

    var RateRouter = Backbone.Router.extend({
        
        routes: {
            'rate'  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
                var rateView = new RateView();
                $('#content').html(rateView.el);
                initializeAutocomplete(BeachModel, "beachname", "beachName")
            })
        },     
    });
    
    return RateRouter;
    
});