define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/loginTemplate.html',
    'jquerycookie',
    'authentication',
], function ($, _, Backbone, loginTemplate, jQueryCookie, Authentication) {
    
    var LoginView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        // Define the events used when binding.
        events: {
            'click .login-button' : 'login'
        },
        
        login: function (event) {
            event.preventDefault();
            
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();
            
            $.ajax({
                type: 'POST',
                url: 'authenticate',
                data: {
                    username: username,
                    password: password
                },
                success: function (data, status, xhr) {
                    Authentication.login(data.user);
                },
                error: function (xhr, status, error) {
                    var $message = $('#login-message');
                    $message.removeClass('hidden');
                    $message.text('Login failed');
                    $('input[name=password]').val('');
                },
            });
        },
        
        render: function () {
            this.$el.html(loginTemplate);
            return this;
        },
        
    });
    
    return LoginView;
    
});
