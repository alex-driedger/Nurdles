var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var uid = require('uid2');


var AccessTokenSchema = new mongoose.Schema({
    _client : { type: ObjectId, required: true },
    _user   : { type: ObjectId, required: true },
    token   : { type: String, required: true, index: { unique: true } }
});

AccessTokenSchema.statics.createWithAttributes = function (token, userId, clientId, callback) {
	var accessToken = new AccessToken({ 
        _client : clientId,
        _user   : userId,
        token   : token
    });
	accessToken.save(function(err, accesToken, numberAffected) {
        return callback(err, accessToken);
	});
};

AccessTokenSchema.statics.findByToken = function (token, callback) {
	AccessToken.findOne({ token: token }, function (err, accessTokens) {
        return callback(err, accessTokens);
	});
};

AccessTokenSchema.statics.findUserWithToken = function (token, callback) {
	if (!token) { return callback(null, false); }
    
    var AccessToken = mongoose.model('AccessToken');
	AccessToken.findByToken(token, function(err, accessToken) {
		if (err) { return callback(err); }
		if (!accessToken) { return callback (null, false); }

        var User = mongoose.model('User');
		User.findById(accessToken._user, function(err, user) {
			if (err) { return callback(err); }
			if (!user) { return callback(null, false); }

			// Include token info when calling the callback. 
            // This is defined in passport-http-bearer.
            var info = { scope: '*' };
			callback(null, user, info);
		});
	});
};

// OAuth2orize

// Parameters are defined for OAuth2orize password exchange. 

AccessTokenSchema.statics.authenticateUserAndCreate = function (client, username, password, scope, callback) {
    var AccessToken = mongoose.model('AccessToken');
    var User = mongoose.model('User');
    
    User.findByUsername(username, function (err, user) {
        if (err) { return callback(err); }
        if (!user) { return callback(null, false); }
        
        user.authenticate(password, function (err, user, options) {
            if (!user) { return done(null, false); }

            // Create the token and exchange it.
            var token = uid(256);
            AccessToken.createWithAttributes(token, user.id, client.id, function(err, accessToken) {
                if (err) { return callback(err); }
                callback(null, token);
            });
        });
    });
};


var AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

module.exports = AccessToken;
