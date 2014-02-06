define([
        'jquery',
        'underscore',
        'backbone',
        'views/RateView',
        'authentication',
], function ($, _, Backbone, RateView, Authentication) {
    
    var RateRouter = Backbone.Router.extend({
        
        routes: {
            // if the route is rate fire Rate
            'rate'  : 'rate',
            'logout' : 'logout'
        },
        
        rate: function () {
            var rateView = new RateView();
            $('#content').html(rateView.el);
        },
        
        logout: function () {
            // This is what happens when you press the Rate button 
            Authentication.logout();
        },
                
    });
    
    return RateRouter;
    
});
