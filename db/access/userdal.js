var User = require('../models/User').User;

var self = {
    create: function(username, password, authKey, callback) {
        User.register(new User({ username: username, exactEarthAuthKey: authKey}), password, function(err, user) {
                if (err) {
                    console.log("ERROR SAVING:", err);
                    callback(err);
                }

                callback(null, user);
            });
    },

    findUserByUsername: function(username, callback) {
        // findByUsername is provided by the passport-local-mongoose plugin module. 
        // The User schema was defined using th
        User.findByUsername(username, function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user);
        });
    },

    findUserByToken: function(token, callback) {
        User.find({ exactEarthAuthKey: token }, function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user);
        });
    }
};

module.exports = self;
