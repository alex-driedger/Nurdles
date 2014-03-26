var path = require("path");
var user = require(path.join(__dirname, "..", "models", "user"));
var mongoose = require("mongoose")
var self = {
    create: function(req, res) {
        var User = mongoose.model('User')
        var username = req.body.username.toLowerCase()
        var atpos=username.indexOf("@");
        var dotpos=username.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=username.length)
        {
            res.send({ObjectId: "", message:"Invalid Email"})
        } else
        {
            // The reason I am doing it this way rather than admin = req.body.admin is because its probably more secure than sending a 
            // admin=false on the client side for normal users
            admin = false;
            if (req.body.admin != undefined)
            {
                admin = true
            }
            User.register(new User({ username: username, admin: admin }), req.body.password, function (err, user) {
                if (err)
                {
                    console.log(err)
                    res.send(err)
                } else
                {
                    res.send(user)
                }
            });
        }
    },

    find: function(req, res) {
        var User = mongoose.model('User')
    User.find(function(err, data)
        {
            res.send(data)
        })
    },
    changePrivelages: function(req, res) {
        var User = mongoose.model('User')
                User.findOne({username: req.params.username}, function (err, data) {
                    if (data == null)
                    {
                        res.send({updatedExisting: false})
                    } else
                    {
                        data.admin = req.params.admin
                        data.save()
                        res.send(data)
                    }
                })

    },
    loginSuccess: function(req, res) {
        var returnedUser = {};
        var user = req.user;
        returnedUser.userId = user._id;
        returnedUser.admin = user.admin

        res.statusCode = 200;
        console.log(user)
        res.send(returnedUser);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect("/");
    },

    routeCallback: function(req, res, err, object) {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            req.login(object, function(err) {
                if (err)
                    console.log("ERROR:", err)
                else {
                    res.send(object);
                }
            });
        }
    }
};

module.exports = self;
