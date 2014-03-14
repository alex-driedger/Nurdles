define([
        'jquery',
        'underscore',
        'backbone',
        'views/SignUpView',
        'authentication'
], function ( $, _, Backbone, SignUpView, Authentication) {

    var SignUpRouter = Backbone.Router.extend({
        
        routes: {
            'signUp'  : 'index'
        },
        
        index: function () {
            var signUpView = new SignUpView();
            $('#content').html(signUpView.el);
        },
                
    });
    
    return SignUpRouter;
    
});