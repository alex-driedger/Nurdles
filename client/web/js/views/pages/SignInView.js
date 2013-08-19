define([
  'baseview',
  'text!templates/pages/SignInView.html',
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
            'click #signin__login': 'loginUser'
        },

        loginUser: function(e) {
            e.preventDefault();
            var view = this;
            $.ajax( {
                type: "POST",
                url: "/api/user/login",
                data: {"username": $("#signin__username").val(), "password": $("#signin__password").val()},
                success: function(data, status, xhr) {
                    view.loginSuccessful(data, view);
                },
                error: this.loginFail,
            });

            $("#signin__login").button("loading");
            $(".controls-group").addClass("hide");
        },

        loginSuccessful: function(data, context) {
            window.user = data;
            context.router.navigate("home", true);

        },

        loginFail: function(xhr, errorType, error) {
            $("#signin__login").button("reset");
            $("#signin__username").val("");
            $("#signin__password").val("");
            $(".controls-group").removeClass("hide");
        }
    });

    return SignInView;
});
