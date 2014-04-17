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
        
        initialize: function (options) {
            this.render();
        },
        
        events: {
            'click #login-button' : 'login',
            'click #signUp-button' : 'signUp'
        },
        signUp: function (event)
        {
            Backbone.history.navigate('signUp', { trigger: true });
        },
        login: function (event) {
            event.preventDefault();
            
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();
            $.ajax({
                type: 'POST',
                url: '/api/user/login',
                data: {
                    username: username.toLowerCase(),
                    password: password
                },
                success: function (data, status, xhr) {
                    Authentication.login(data);
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
