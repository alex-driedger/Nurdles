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
                success: function(res) {
                    console.log(res.toJSON)
                },
                error: function (err) {
                    console.log(err)
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
