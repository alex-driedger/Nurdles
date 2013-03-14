define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/pages/SignInView.html'
], function($, _, Backbone, signInTemplate){

    var SignInView = Backbone.View.extend({

        initialize:function () {
        },

        render:function () {
            this.$el.append(signInTemplate);

            return this;
        },

        events: {
            'click #registerLinkDiv': 'registerClick',
            "click #loginButton": "loginUser"
        },

        registerClick: function () {
            console.log("Onclick");
        },

        loginUser: function(e) {
            e.preventDefault();
            $.ajax( {
                type: "POST",
                url: "/api/user/login",
                data: {"username": $("#username").val(), "password": $("#password").val()},
                success: this.loginSuccessful,
                error: this.loginFail,
            });

            $("#loginButton").button("loading");
            $(".controls-group").addClass("hide");
        },

        loginSuccessful: function(data, status, xhr) {
            window.user = data;

        },

        loginFail: function(xhr, errorType, error) {
            $("#loginButton").button("reset");
            $("#email").val("");
            $("#password").val("");
            $(".controls-group").removeClass("hide");
        }
    });

    return SignInView;
});
