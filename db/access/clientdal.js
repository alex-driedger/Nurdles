var Client = require('../models/Client.js').Client;

var self = {
	create: function(clientId, clientSecret, callback) {
		var client = new Client({ clientId: clientId, clientSecret: clientSecret });
		client.save(function(err, client, numberAffected) {
			if (err)
				return callback(err);
			else
				return callback(null, client);
		});
	},

	findClientById: function(id, callback) {
		Client.find(id, function(err, client) {
			if (err)
				return callback(err);
			else
				return callback(null, client);
		});
	},

	findClientByClientId: function(clientId, callback) {
		Client.findOne({ clientId: clientId }, function(err, client) {
			if (err)
				return callback(err);
			else
				return callback(null, client);
		});
	}
};

module.exports = self;
