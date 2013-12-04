var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema, User, mongoose;
var path = require("path");
var mongoose = require(path.join("..", "..", "config", "db.config")).getMongoose();

var self = {
    init: function() {
        UserSchema = new mongoose.Schema({
            username: { type: String, required: true, index: { unique: true } },
            password: {type: String, require: true },
            exactEarthAuthKey: { type: String, required: true },
            activeFilters: { type: [mongoose.Schema.ObjectId], required: false},
            accessRights: { type: mongoose.Schema.Types.Mixed, required: true, default: {multipleLayers: false} },
            preferences: { type: mongoose.Schema.Types.Mixed, required: "true", default: {
                latLong: {
                    enabled: "true"
                },
                measure: {
                    enabled: "true",
                    units: "km"
                },
                manageState: {
                    enabled: "true"
                },
            }},
            settings: { type: mongoose.Schema.Types.Mixed, required: true, default: { }},
            bookmarks: { type: [mongoose.Schema.Types.Mized], required: false },
            state: { type: mongoose.Schema.Types.Mixed, required: true, default: { }}
        });

        UserSchema.plugin(passportLocalMongoose);

        User = mongoose.model("User", UserSchema);
    },

    create: function(username, password, authKey, callback) {
        var User = mongoose.model("User");
        console.log("TEST");
        User.register(new User({ username : username, exactEarthAuthKey: authKey}), password, function(err, user) {
                if (err) {
                    console.log("ERROR SAVING:", err);
                    callback(err);
                }

                callback(null, user);
            });
    },

    findUserByUsername: function(username, callback) {
        var User = mongoose.model("User");
        User.findByUsername(username, function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user);
        });
    },

    updatePreferences: function(id, preferences, callback) {
        var User = mongoose.model("User");
        User.update({_id: id}, {$set: {preferences: preferences}}, function(err, numOfUsers) {
            callback(err);
        });
    },

    updateSettings: function(id, settings, callback) {
        var User = mongoose.model("User");
        User.update({_id: id}, {$set: {settings: settings}}, function(err, numOfUsers) {
            callback(err);
        });
    },

    updateBookmarks: function(id, bookmarks, callback) {
        var User = mongoose.model("User");
        User.update({_id: id}, {bookmarks: bookmarks}, function(err, numOfUsers) {
            callback(err);
        });
    },

    saveState: function(id, state, callback) {
        var User = mongoose.model("User");
        User.update({_id: id}, {state: state}, function(err, numOfUsers) {
            callback(err);
        });
    },

    loadState: function(id, callback) {
        var User = mongoose.model("User");
        User.findOne({_id: id}, {state: 1}, function(err, user) {
            callback(err, user.state);
        });
    },

    getAuthKey: function(id, callback) {
        var User = mongoose.model("User");
        User.findOne({_id: id}, {exactEarthAuthKey: 1}, function(err, user) {
            callback(err, user.exactEarthAuthKey);
        });
    },
};

module.exports = self;

