var mongoose = require('../init').getMongoose(),
	ObjectId = mongoose.Schema.ObjectId;


var AccessTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, index: { unique: true } },
    userId: { type: ObjectId, required: true },
    clientId: { type: ObjectId, required: true }
});

var AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

module.exports = {
    AccessToken: AccessToken,
    AccessTokenSchema: AccessTokenSchema
};
