define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/adminTemplate.html',
    'jquerycookie',
    'models/User',
    'authentication'
], function ($, _, Backbone, adminTemplate, jQueryCookie, UserModel, authentication) {
    
    var AdminTemplateView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
            'click .btn-surveyButtons' : 'expand',
            'click #createAdmin' : 'createAdmin',
            'click #upgradeToAdmin' : 'upgradeToAdmin',
            'click #logout' : 'logout'
        },

        logout: function () {
            authentication.logout()
        },
        upgradeToAdmin: function() {
            username = document.getElementById("username2").value
            if (username != "")
            {
                users = new UserModel.Collection([], {username: username});
                users.fetch( {
                    success: function( collection, response, options) {
                    attributes = collection.models[0].attributes
                    console.log(attributes)
                    if (attributes.updatedExisting)
                    {
                        alert("User was upgraded")
                    } else
                    {
                        alert("User not found")
                    }
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
            }
        },
        createAdmin: function () {
            username = document.getElementById("username").value
            password = document.getElementById("password").value
            userModel = new UserModel.Model();
            userModel.save({username: username, password:password, admin: true}, {
                success: function(res, res2) {
                    if (res2.message != undefined)
                    {
                        alert(res2.message)
                    } else
                    {
                        alert("Your account has been created")
                    }
                },
                error: function (err,err2) {
                    alert(err2.responseText)
                }
            })
        },
        expand: function (events) {
        id = events.currentTarget.id
        if ($("#block_"+id).is(":visible"))
            {
                $("#block_"+id).slideUp(750)
                if (id.length == 1)
                {
                    $("#"+id).animate({color: "black"},750)
                } else
                {
                    $("#"+id).animate({color: "gray"},750)
                }

            } else
            {
                $('body').animate({
                    scrollTop: $("#"+id).offset().top
                },750)
                    $("#"+id).animate({color: "#3AF"}, 750)
                    $("#block_"+id).slideDown(750 )
            }
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            this.$el.html(adminTemplate);
            return this;
        },
        
    });
    
    return AdminTemplateView;
    
});
