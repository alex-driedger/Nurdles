var mongoose = require('../init').getMongoose();

var ClientSchema = new mongoose.Schema({
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: false }
});

var Client = mongoose.model("Client", ClientSchema);

module.exports = {
    Client: Client,
    ClientSchema: ClientSchema
};
