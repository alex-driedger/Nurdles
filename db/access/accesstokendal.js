var AccessToken = require('../models/AccessToken.js').AccessToken;

var self = {
	create: function(token, userID, clientID, callback) {
		var accessToken = new AccessToken({ 'token': token, 'userID': userID, 'clientID': clientID });
		accessToken.save(function(err, accesToken, numberAffected) {
			if (err)
				return callback(err);
			else
				return callback(null, accessToken);
		});
	},

	findAccessTokenByToken: function(token, callback) {
		AccessToken.find({ 'token': token }, function(err, accessToken) {
			if (err)
				return callback(err);
			else
				return callback(null, accessToken);
		});
	}
};

module.exports = self;
