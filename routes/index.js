function bind(app, passport) {
    var user = require('./user'),
    map = require('./map'),
    proxy = require('./proxy');

    app.get('/', ensureAuthenticated, function(res, req) {
        res.send(req.user);
    });
    app.post("/api/user", user.create);
    app.get('/api/user/checkAuth', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });
    app.post("/api/user/login", passport.authenticate("local"), user.loginSuccess);
    app.get("/api/map/basic", ensureAuthenticated, map.getBasic);
    app.post("/proxy", proxy.proxyIt);
    app.get("/proxy", proxy.proxyIt);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        console.log("Auth successful!");
        return next(); 
    }
    console.log("Auth NOT Successful!");
    res.writeHead("401", {
        'Content-Type': 'text/json'
    });
    res.end();
}

module.exports = {
    bind: bind,
};

