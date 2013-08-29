var mongoose = require('../init').getMongoose();

var AccessTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, index: { unique: true } },
    userID: { type: String, required: true },
    clientID: { type: String, required: true }
});

var AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

module.exports = {
    AccessToken: AccessToken,
    AccessTokenSchema: AccessTokenSchema
};



