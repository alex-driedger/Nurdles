var AccessToken = require('../models/AccessToken.js').AccessToken;

var self = {
	create: function(token, userId, clientId, callback) {
		var accessToken = new AccessToken({ token: token, userId: userId, clientId: clientId });
		accessToken.save(function(err, accesToken, numberAffected) {
			if (err)
				return callback(err);
			else
				return callback(null, accessToken);
		});
	},

	findAccessTokenByToken: function(token, callback) {
		AccessToken.find({ token: token }, function(err, accessToken) {
			if (err)
				return callback(err);
			else
				return callback(null, accessToken);
		});
	}
};

module.exports = self;
