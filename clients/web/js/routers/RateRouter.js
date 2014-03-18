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
          
                    var rateView = new RateView();
                    $('#content').html(rateView.el);
                    initializeAutocomplete(BeachModel, "beachname", "beachName")


       },
                
    });
    
    return RateRouter;
    
});