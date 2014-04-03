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
            'click #createBeach' : 'createBeach',
            'click .changeBeach' : 'changeBeach',
            'click #logout' : 'logout'
        },
        changeBeach: function(event)
        {
            id = event.target.attributes[0].value.split("_")[1]
            firstChar = event.target.attributes[0].value.charAt(0)
            if(firstChar == "d" )
            {
                beaches = new BeachModel.Collection([], {id: id});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        $("#title_" + id).animate({height: '0px', padding: '0px', marginTop: "-5px"}, 500, function() {
                            $(this).hide()
                        })
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
            } else if (firstChar == "e")
            {
                editData = $("#editData_" + id)
                if (editData.is(":visible"))
                {
                    editData.slideUp(500);
                } else
                {
                    editData.slideDown(500);
                }
            } else
            {
            beachName = $("#edit_beachName_" + id).val().toUpperCase()
            city = $("#edit_city_" + id).val().toUpperCase()
            state = $("#edit_state_" + id).val().toUpperCase()
            country = $("#edit_country_" + id).val().toUpperCase()
            lat = parseInt($("#edit_lat_" + id).val())
            lon = parseInt($("#edit_lon_" + id).val())
            if (beachName != "" || city != "" || state != "" || country != "" || lat != "" || lon != "")
            {
                beachModel = new BeachModel.Model(
                {
                        id_: id,
                        beachName: beachName,
                        city: city,
                        state: state,
                        country: country,
                        lat: lat,
                        lon: lon,
                        created: new Date()
                })
                beachModel.save(null, {
                    success: function (res) {
                        attributes = res.attributes
                        $("#title_" + id).slideUp(500,function()
                        {
                            $("#data_" + id)[0].firstChild.data = attributes.beachName
                            $("#city_" + id)[0].firstChild.data = attributes.city
                            $("#state_" + id)[0].firstChild.data = attributes.state
                            $("#country_" + id)[0].firstChild.data = attributes.country
                            $("#lat_" + id)[0].firstChild.data = attributes.lat
                            $("#lon_" + id)[0].firstChild.data = attributes.lon
                            $("#title_" + id).slideDown(500)
                        })
                    },
                    error: function (err, err2, err3) {
                        console.log("ERR")
                    }
                });
            } else
            {
                alert("Atleast 1 field must be filled")
            }
            }
        },
        createBeach: function() 
        {
            that = this
            beachName = $("#beachName").val()
            city = $("#city").val()
            state = $("#state").val()
            country = $("#country").val()
            lat = parseInt($("#lat").val()) || ""
            lon = parseInt($("#lon").val()) || ""
            if (beachName != "" && city != "" && state != "" && country != "" && lat != "" && lon != "")
            {
                beachModel = new BeachModel.Model({
                    beachName: beachName,
                    city: city,
                    state: state,
                    country: country,
                    lat: lat,
                    lon: lon,
                    created: new Date()
                    });
                beachModel.save(null, {
                    success: function (res) {
                        alert('Your beach has been created')
                        // unshift adds to the start of the list
                        // we unshift so that the admin can see the new beach right away
                        that.collection.models.unshift(res)
                        that.render()
                    },
                    error: function (err, err2, err3) {
                        console.log(err)
                    }
                });
            } else
            {
                alert("All fields must be filled")
            }
        },
        import: function()
        {
        that = this
          beachModel = new BeachModel.Model();
          beachModel.save(null, {
                    success: function (res) {
                        alert(res.attributes.message)
                        that.render();
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
                console.log($("#"+id).offset().top)
                $('body').animate({
                    scrollTop: $("#"+id).offset().top
                },750)
                    $("#"+id).animate({color: "#3AF"}, 750)
                    $("#block_"+id).slideDown(750 )
            }
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.collection = options.collection
            this.render();
        },
        
        render: function () {
            this.$el.html(_.template(adminTemplate,{data: this.collection.models}));
            return this;
        },
        
    });
    
    return AdminTemplateView;
    
});
