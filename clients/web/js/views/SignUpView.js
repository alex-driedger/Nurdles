define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/signUpTemplate.html',
    'jquerycookie',
    'models/User'
], function ($, _, Backbone, signUpTemplate, jQueryCookie, UserModel) {
    
    var SignUpView = Backbone.View.extend({

        tagName   : 'div',
        className : '',

        events: {
            'click #submit' : 'submit',
            'click #back' : 'back'
        },
        back: function() {
            Backbone.history.navigate('login', { trigger: true });
        },
        submit: function() {
            username = document.getElementById("username").value
            password = document.getElementById("password").value
            userModel = new UserModel.Model();
            userModel.save({username: username, password:password}, {
                success: function(res, res2) {
                    console.log("success")
                    if (res2.message != undefined)
                    {
                        alert(res2.message)
                    } else
                    {
                        alert("Your account has been created")
                        window.location.href = "#"
                    }
                },
                error: function (err,err2) {

                    console.log(err2)
                    alert(err2.responseText)
                }
            })
        },
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(signUpTemplate);
            return this;
        },
        
    });
    
    return SignUpView;
    
});
