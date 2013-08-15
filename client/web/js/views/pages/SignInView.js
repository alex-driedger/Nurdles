define([
  'baseview',
  'text!templates/pages/SignInView.html',
  'bootstrap'
], function(Baseview, signInTemplate){

    var SignInView = Baseview.extend({

        initialize:function (opts) {
            this.router = opts.router;
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
            var view = this;
            $.ajax( {
                type: "POST",
                url: "/api/user/login",
                data: {"username": $("#username").val(), "password": $("#password").val()},
                success: function(data, status, xhr) {
                    view.loginSuccessful(data, view);
                },
                error: this.loginFail,
            });

            $("#loginButton").button("loading");
            $(".controls-group").addClass("hide");
        },

        loginSuccessful: function(data, context) {
            window.user = data;
            context.router.navigate("home", true);

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
