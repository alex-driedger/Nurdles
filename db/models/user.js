var mongoose = require('../index').getMongoose(),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    name: { type:String },
    username: { type: String, required: true, index: { unique: true } },
    password: {type: String, require: true },
    locations: {type: [mongoose.Schema.ObjectId]},
    lastLocation: {type: mongoose.Schema.ObjectId},
    lastLocationName: {type: String }
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);


module.exports = {
    User: User,
    UserSchema: UserSchema
};

