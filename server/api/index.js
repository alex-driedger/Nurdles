function bindRoutes( app, passport ) {
    // Load in API functionality
    var user = require('./user'),
        stateManager = require('./statemanager'),
        oauth2 = require('../oauth2')
        ;

    // Setup routes
    app.get('/', ensureAuthenticated, function(res, req) {
        res.send(req.user);
    });
    
    app.post("/api/user", user.create);
    app.get('/api/user/checkAuth', ensureAuthenticated, function(req, res) { 
        res.send({userId: req.user._id, access: req.user.accessRights}); 
    });
    app.post("/api/user/login", passport.authenticate("local"), user.loginSuccess);

    // Setup OAuth routes
    app.get('/oauth/authorize', oauth2.authorization);
    app.post('/oauth/authorize/token', oauth2.token);

    app.get("/oauth/user", [
        passport.authenticate("bearer", { session: false })
    ], user.loginSuccess);
}

function ensureAuthenticated( req, res, next ) {
    if (req.isAuthenticated()) { 
        return next(); 
    }
    res.writeHead("401", {
        'Content-Type': 'text/json'
    });
    res.end();
}

module.exports = {
    bindRoutes: bindRoutes
};