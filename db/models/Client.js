var mongoose = require('../init').getMongoose();

var ClientSchema = new mongoose.Schema({
    clientID: { type: String, required: true, index: { unique: true } },
    clientSecret: { type: String }
});

var Client = mongoose.model("Client", ClientSchema);

module.exports = {
    Client: Client,
    ClientSchema: ClientSchema
};
