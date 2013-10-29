var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var ClientSchema = new mongoose.Schema({
    clientId     : { type: String, required: true },
    clientSecret : { type: String, required: false }
});

ClientSchema.statics.createWithClientIdAndSecret = function (clientId, clientSecret, callback) {
	var Client = mongoose.model('Client');
	var client = new Client({ 
        clientId     : clientId, 
        clientSecret : clientSecret 
    });
	client.save(function (err, client, numberAffected) {
        return callback(err, client);
	});
};

ClientSchema.statics.findByClientId = function (clientId, callback) {
	var Client = mongoose.model('Client');
    Client.findOne({ clientId: clientId }, function (err, client) {
        return callback(err, client);
	});
};

// Passport-specific

ClientSchema.statics.findByClientIdAndSecret = function (clientId, clientSecret, callback) {
	var Client = mongoose.model('Client');
	Client.findByClientId(clientId, function (err, client) {
		if (err) { return callback(err); }
		if (!client) { return callback(null, false); }
		if (client.clientSecret != clientSecret) { return callback(null, false); }
		return callback(null, client);
	});
};

// OAuth2orize-specific

ClientSchema.statics.serializeClient = function () {
    return function (client, callback) {
        return callback(null, client.id);  
    };
};

ClientSchema.statics.deserializeClient = function () {
    return function (id, callback) {
        var Client = mongoose.model('Client');
        Client.findById(id, function (err, client) {
            return callback(err, client);
        });
    };
};


var Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
