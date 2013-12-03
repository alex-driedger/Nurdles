module.exports = function (app) {
    
    var mongoose = app.mongoose;
    var ObjectId = mongoose.Schema.ObjectId;
    var passportLocalMongoose = require('passport-local-mongoose');

    var UserSchema = new mongoose.Schema({
        username : { type: String, required: true, index: { unique: true } }
    });

    // Register the passport-local-mongoose plugin

    UserSchema.plugin(passportLocalMongoose);

    // Convenience method for creating

    UserSchema.statics.createWithUsernameAndPassword = function (username, password, callback) {
        User.register(new User({ username: username }), password, function (err, user) {
            return callback(err, user);
        });
    };

    var User = mongoose.model("User", UserSchema);
    
    return User;
    
};
