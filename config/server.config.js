
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return next(); 
    }
    res.writeHead("401", {
        'Content-Type': 'text/json'
    });
    res.end();
}

/*
* End of Middleware components
*/

var express = require('express'),
    path = require("path"),
    conf = require(path.join(__dirname, "..", "server", "conf")),
    dbConfig = require(path.join(__dirname, "db.config")),
    passportConfig = require(path.join(__dirname, "passport.config")),
    oathConfig = require(path.join(__dirname, "oauth.config")),
    repl = require('repl'),
    passport = require('passport'),
    utils = require('connect').utils, 
    _ = require("underscore");

var _self = {
    configure: function(app, opts, params) {
        var port = opts.port || conf.ports.server,
            lactate = require("lactate"),
            public_folder = path.join(__dirname, '..', 'clients', 'web'),
            files = lactate.dir(public_folder)
            ;

            console.log(public_folder)

        app.use(express.bodyParser()),
        app.use(express.methodOverride());
        app.use(express.cookieParser("clubsandwichofpain"));
        app.use(express.session());
        app.use(passport.initialize());
        app.use(passport.session());

        app.db = dbConfig.createDb();
        app.passport = passport;

    //CONFIGURE DB AND AUTH --------------------/
        dbConfig.configureMongooseModels(path.join(__dirname, "..", "server", "models"), app.db);
        passportConfig.createStrategy("local", app)
        app.oath = oathConfig.configure(app);
        this.bindRoutes(path.join(__dirname, "..", "server", "api"), app);
        dbConfig.seed(app.db);
    //End config --------------------------------/

        files.set("cache", false);
        files.maxAge(1); //Disable caching for client side changes to take effect without needing to clear the cache

        if (_.contains(params, "--gzip")) {
            console.log("GZIPPING assets");
            app.use(files.toMiddleware());
        } else {
            app.use(express.static(public_folder));
        }

        app.listen(port);
        console.log("INFO: Running server on:", port);
    },

    bindRoutes: function(routeDir, app) {
        var router = {};
        var fs = require('fs');
        var files = fs.readdirSync(routeDir);
        var lactate = require('lactate').Lactate({ });
        var http = require('http');

        files.forEach(function (file) {
            var key = file.substring(0, file.indexOf(".js"));
            if (file != ".DS_Store")
            {
                router[key] = require(routeDir + "/" + file);
            }
        });


//Default API endpoints---------------------------/
        app.get('/', function(req, res) {
            lactate.serve('clients/web/index.html', req, res)
        })
        app.get("/api/user/:username/:admin", router.user.changePrivelages)
        app.post("/api/user", router.user.create);
        app.get('/api/user/checkAuth', ensureAuthenticated, function(req, res) { 
            res.send({
                userId: req.user._id, 
                username: req.user.username,
            }); 
        });
        app.post("/api/user/login", passport.authenticate("local"), router.user.loginSuccess);
        app.get("/api/user/logout", router.user.logout);

        app.post("/api/rate", router.rate.create);
        app.get("/api/rate", router.rate.retrieveAll);
        app.put( "/api/rate/:id", router.rate.update );
        app.delete( "/api/rate/:id", router.rate.delete );
        app.get("/api/rate/:id", router.rate.create);
        app.post("/api/rate/:id", router.rate.retrieveAll);

        app.post("/api/survey", router.survey.create);
        app.get("/api/survey/:id/:start/:end", router.survey.retrieveAll);
        app.put( "/api/survey/:id", router.survey.update );
        app.delete( "/api/survey/:id", router.survey.delete );
        app.get("/api/survey/:id", router.survey.retrieveOne);

        app.post( "/api/beach", router.beach.prepareDatabase );
        app.get( "/api/beach", router.beach.retrieveAll );
        app.post( "/api/beach/create", router.beach.create)
        app.get( "/api/beach/lat=:lat/lon=:lon/amount=:amount", router.beach.getClosest );
        app.get( "/api/beach/:id/recent/surveys", router.beach.recentSurveys );
        app.get( "/api/beach/:id/recent/rates", router.beach.recentRates );
        app.get( "/api/beach/:id", router.beach.retrieveOne );
        app.get( "/api/beach/id/:attribute/:data", router.beach.find );
        app.get( "/api/beach/id/:attribute/:data/:limit", router.beach.find );
        app.get( "/api/beach/destroy/:id", router.beach.destroy );
        app.get("/api/beach/forecast/:lat/:lon", router.beach.getForecast)
        app.post("/api/beach/update/:id", router.beach.update)
//End of default endpoints-------------------------/
    }


};

module.exports = _self;
