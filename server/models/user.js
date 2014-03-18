module.exports = function (mongoose) {
    
    var ObjectId = mongoose.Schema.ObjectId;
    var passportLocalMongoose = require('passport-local-mongoose');

    var UserSchema = new mongoose.Schema({
        username : { type: String, required: true, index: { unique: true } },
        admin : Boolean
    });
    UserSchema.plugin(passportLocalMongoose);
    var User = mongoose.model("User", UserSchema);
    
    return User;
    
};
