function bind(app, passport) {
    var user = require('./user'),
    map = require('./map'),
    proxy = require('./proxy'),
    filter = require('./filter');

    app.get('/', ensureAuthenticated, function(res, req) {
        res.send(req.user);
    });
    app.post("/api/user", user.create);
    app.get('/api/user/checkAuth', ensureAuthenticated, function(req, res) { res.send(req.user._id); });
    app.post("/api/user/login", passport.authenticate("local"), user.loginSuccess);

    app.get("/api/map/basic", ensureAuthenticated, map.getBasic);

    app.get("/api/filters/getAllForUser", ensureAuthenticated, filter.getAllForUser);
    app.post("/api/filters/save", ensureAuthenticated, filter.create);
    app.post("/api/filters/:filterId/update", ensureAuthenticated, filter.update);
    app.delete("/api/filters/:filterId", ensureAuthenticated, filter.remove);

    app.post("/proxy", proxy.defaultProxy);
    app.get("/proxy", proxy.defaultProxy);
    app.get("/proxy/features", proxy.getFeatures);
    app.get("/proxy/getCapabilities", proxy.getCapabilities);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return next(); 
    }
    res.writeHead("401", {
        'Content-Type': 'text/json'
    });
    res.end();
}

module.exports = {
    bind: bind,
};

