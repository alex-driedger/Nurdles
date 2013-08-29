var Client = require('../models/Client.js').Client;

var self = {
	create: function(clientID, clientSecret, callback) {
		var client = new Client({ 'clientID': clientID, 'clientSecret': clientSecret });
		client.save(function(err, client, numberAffected) {
			if (err)
				return callback(err);
			else
				return callback(null, client);
		});
	},

	findClientByClientID: function(clientID, callback) {
		Client.find({ 'clientID': clientID }, function(err, client) {
			if (err)
				return callback(err);
			else
				return callback(null, accessToken);
		});
	}
};

module.exports = self;
