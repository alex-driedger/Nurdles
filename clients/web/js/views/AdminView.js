define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/adminTemplate.html',
    'jquerycookie',
    'authentication',
    'models/User',
    'models/Beach',
], function ($, _, Backbone, adminTemplate, jQueryCookie, authentication, UserModel, BeachModel) {
    
    var AdminTemplateView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
            'click .btn-surveyButtons' : 'expand',
            'click #createAdmin' : 'createAdmin',
            'click .changeAdmin' : 'changeAdmin',
            'click #import' : 'import',
            'click #logout' : 'logout'
        },
        import: function()
        {
          beachModel = new BeachModel.Model();
          beachModel.save({
                    success: function (res) {
                        console.log(res.toJSON());
                    },
                    error: function (err, err2, err3) {
                        console.log(err)
                    }
                });
        },
        logout: function () {
            authentication.logout()
        },
        changeAdmin: function(event) {
            username = document.getElementById("username2").value
            if (username != "")
            {
                admin = false
                if (event.target.attributes.id.value == "upgradeToAdmin")
                {
                    admin = true
                }
                users = new UserModel.Collection([], {username: username,  admin: admin});
                users.fetch( {
                    success: function( collection, response, options) {
                    attributes = collection.models[0].attributes
                    if (attributes.updatedExisting == false)
                    {
                        alert("User not found")
                    } else
                    {
                        if (attributes.admin == true)
                        {
                            alert("User " + attributes.username + " is now an admin")
                        } else
                        {
                            alert("User " + attributes.username + " is no longer an admin")
                        }
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
