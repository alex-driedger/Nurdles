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
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click #submit' : 'submit'
        },
        // redirect is used on successful create or update.
        submit: function(event) {
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
