var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var oauth2orize = require('oauth2orize');


module.exports = {

    configure: function(app) {
        var mongoose = app.db;
        var oauth = oauth2orize.createServer();
        var passport = app.passport;
        
        // Models
        var AccessToken = mongoose.model('AccessToken');
        var Client = mongoose.model('Client');

        // Register the authentication strategies. 
        passport.use(new BasicStrategy(Client.findByClientIdAndSecret));
        passport.use(new BearerStrategy(AccessToken.findUserWithToken));
        passport.use(new ClientPasswordStrategy(Client.findByClientIdAndSecret));

        // Register the password exchange functions.
        oauth.exchange(oauth2orize.exchange.password(AccessToken.authenticateUserAndCreate));

        // Register the client serialization functions.
        oauth.serializeClient(Client.serializeClient());
        oauth.deserializeClient(Client.deserializeClient());
        
        return oauth;
    }
};
