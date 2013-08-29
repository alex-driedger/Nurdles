/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize')
  , passport = require('passport')
  , api = require('./api')
  , db = require('./db')
  , userDAL = require('./db/access/userdal.js')
  , clientDAL = require('./db/access/clientdal.js')
  , accessTokenDAL = require('./db/access/accesstokendal.js')
  ;

// Create the server.
var server = oauth2orize.createServer();

// Provide serialization functions so the client object can be stored in the session.
server.serializeClient(function(client, callback) {
	return callback(null, client.id);
});
server.deserializeClient(function(id, callback) {
	clientDAL.findClientByClientID(id, function(err, client) {
		if (err)
			return callback(err);
		else
			return callback(null, client);
	});
});

// Exchange passwords for access tokens.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
  userDAL.findUserByUsername(username, function(err, user) {
    if (err) { return done(err); }
    if (username !== user.username) { return done(null, false); }
    if (password !== user.password) { return done(null, false); }
    
    var token = utils.uid(256)
    accessTokenDAL.create(token, user.id, client.id, function(err) {
      if (err) { return done(err); }
      done(null, token);
    });
  });
}));


///////////////
// ENDPOINTS //
///////////////

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectURI` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectURI` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view. 

exports.authorization = [
  api.ensureAuthenticated(),
  server.authorization(function(clientID, redirectURI, done) {
    clientDAL.findClientByClientId(clientID, function(err, client) {
      if (err) { return done(err); }
      // WARNING: For security purposes, it is highly advisable to check that
      //          redirectURI provided by the client matches one registered with
      //          the server.  For simplicity, this example does not.  You have
      //          been warned.
      return done(null, client, redirectURI);
    });
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  api.ensureAuthenticated(),
  server.decision()
]

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]
