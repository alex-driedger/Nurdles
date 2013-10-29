var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username      : { type: String, required: true, index: { unique: true } },
    password      : { type: String, required: true },
    group         : { type: String, required: false }
});

// Register the passport-local-mongoose plugin

UserSchema.plugin(passportLocalMongoose);

// Convenience method for creating

UserSchema.statics.createWithAttributes = function (username, password, group, callback) {
    User.register(new User({ username: username, group: group }), password, function (err, user) {
        return callback(err, user);
    });
};

var User = mongoose.model("User", UserSchema);

module.exports = User;