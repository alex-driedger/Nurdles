define([
        'jquery',
        'underscore',
        'backbone',
        'views/SignUpView',
], function ( $, _, Backbone, SignUpView) {

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