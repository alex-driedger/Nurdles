var path = require("path");
var user = require(path.join(__dirname, "..", "models", "user"));
var mongoose = require("mongoose")
var self = {
    create: function(req, res) {
        var User = mongoose.model('User')
        User.createWithUsernameAndPassword(req.body.username, req.body.password, function(err, user) {
            res.send(err, user);
        });
        console.log(req)
    },

    loginSuccess: function(req, res) {
        var returnedUser = {};
        var user = req.user;

        returnedUser.access = user.access;
        returnedUser.bookmarks = user.bookmarks;
        returnedUser.preferences = user.preferences;
        returnedUser.settings = user.settings;
        returnedUser.state = user.state;
        returnedUser.userId = user._id;

        res.statusCode = 200;
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
