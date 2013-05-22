var User = require('../models/User').User;

var self = {
    create: function(username, password, authKey, callback) {
        User.register(new User({ username : username, exactEarthAuthKey: authKey}), password, function(err, user) {
                if (err) {
                    console.log("ERROR SAVING:", err);
                    callback(err);
                }

                callback(null, user);
            });
    },

    findUserByUsername: function(username, callback) {
        User.findByUsername(username, function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user);
        });
    }
};

module.exports = self;
