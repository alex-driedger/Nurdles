var User = require('../models/user').User;

var self = {
    create: function(name, username, password, callback) {
        console.log(name, username, password);
        User.register(new User({ username : username, name: name, locations: [], lastLocation: "", lastLocationName: "" }), password, function(err, user) {
                if (err) {
                    console.log("ERROR SAVING:", err);
                    callback(err);
                }

                callback(null, user);
            });
    },

    findUserById: function(username, callback) {
        User.findByUsername({username: username}, function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user);
        });
    }
};

module.exports = self;
