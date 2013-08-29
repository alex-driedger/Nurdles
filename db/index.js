var jWorkflow = require('jWorkflow'),
	mongoose = require('mongoose'),
	bootstrap = require("./bootstrap"),
	initDB = require("./init"),
	passport,
	LocalStrategy = require('passport-local').Strategy,
  	BasicStrategy = require('passport-http').BasicStrategy,
  	ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
	User,
	Client,
	AccessToken,
	isMappedAlready;

function createDb(initialValue, baton) {
	baton.take();
	passport = initialValue;
	isMappedAlready = false;

	initDB.createDb(mongoose, function(mongoose) {
		baton.pass();
	});
}

function createModels (previous, baton) {
	baton.take();
	User = require("./models/User").User;
	Client = require("./models/Client").Client;
	AccessToken = require("./models/AccessToken").AccessToken;
	baton.pass();
}

function initSettings (previous, baton) {
	baton.take();
	that = this;
	Setting.findOne({type: "init"}, function(err, item) {
		if (err) {
			console.log("Error finding init setting");
			baton.drop();
		}
		else if (item && item.value == "true") {
			console.log("Connected to database and ready");
			that.isMappedAlready = true;
			baton.pass();
		}
		else {
			console.log("Blank slate -- initializing...");
			Setting.create({type: "init", value: true}, function(err, setting) {
				if (err) {
					console.log("Error setting init value: ", err);
					baton.drop();
				}
				else
					baton.pass();
			});
		}
	});
}

function initPassport (previous, baton) {
	baton.take();
	
	passport.use(new LocalStrategy(User.authenticate()));
	
	passport.use(new BasicStrategy(
	  function(clientID, clientSecret, done) {
	    var clientDAL = require("./access/clientdal.js");
	    clientDAL.findClientByClientId(clientId, function(err, client) {
	      if (err) { return done(err); }
	      if (!client) { return done(null, false); }
	      if (client.clientSecret != clientSecret) { return done(null, false); }
	      return done(null, client);
	    });
	  }
	));
	
	passport.use(new ClientPasswordStrategy(
	  function(clientId, clientSecret, done) {
	    var clientDAL = require("./access/clientdal.js");
	    clientDAL.findClientByClientId(clientId, function(err, client) {
	      if (err) { return done(err); }
	      if (!client) { return done(null, false); }
	      if (client.clientSecret != clientSecret) { return done(null, false); }
	      return done(null, client);
	    });
	  }
	));

	passport.use(new BearerStrategy(
	  function(accessToken, done) {
	    var accessTokenDAL = require("./access/accesstokendal.js");
	    accessTokenDAL.findAccessTokenByToken(accessToken, function(err, token) {
	      if (err) { return done(err); }
	      if (!token) { return done(null, false); }
	      
	      var userDAL = require("./access/userdal.js");
	      userDAL.find({ 'id': token.userId }, function(err, user) {
	        if (err) { return done(err); }
	        if (!user) { return done(null, false); }
	        // to keep this example simple, restricted scopes are not implemented,
	        // and this is just for illustrative purposes
	        var info = { scope: '*' }
	        done(null, user, info);
	      });
	    });
	  }
	));

	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

	baton.pass();
}

function mapData(previous, baton) {
	baton.take();
	try {
		if (!this.isMappedAlready)
			bootstrap.load();
		baton.pass();
	}
	catch(e) {
		console.log("SERIOUS Error: Cannot map data...");
		console.log(e);
		baton.drop();
	}
}

/*-------PUBLIC METHODS-------*/

var self = {
	init: function(passport) {
		try {
			console.log("STARTING");
			var initWorkflow = jWorkflow.order(createDb)
				.andThen(createModels)
				.andThen(initPassport)
				.andThen(mapData); //Include if you need to bootstrap data, remove otherwise

			initWorkflow.start({initialValue: passport}); //Get rid of passport if not using auth
		}
		catch(e) {
			//OMG WTF Whahappened?
			console.log(e);
		}
	},

	getMongoose: function() {
		return mongoose;
	}
};

module.exports = self;
