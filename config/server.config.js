
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

        /* used for debugging so we'll turn it off
            setTimeout(function(){
                repl.start(
                    {
                        prompt:">>", 
                        input: process.stdin, 
                        output: process.stdout
                    }).context.utils = utils;
            }, 1000);
        */
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

        app.post("/api/user", router.user.create);
        app.get('/api/user/checkAuth', ensureAuthenticated, function(req, res) { 
            res.send({
                userId: req.user._id, 
                username: req.user.username,
            }); 
        });
        app.post("/api/user/login", passport.authenticate("local"), router.user.loginSuccess);
        app.get("/api/user/logout", router.user.logout);
        app.post("/beach", router.beach.createBeach);
        app.post("/fn", router.beach.findByName);
        app.post("/fa", router.beach.findByAddress);
        app.post("/fg", router.beach.findByGeolocation);
        app.post("/beaches", router.beach.displayBeaches);
        app.post("/clear", router.beach.clearDatabase);
        app.post("/r", router.report.createReport);
        app.post("/c", router.report.clearReports);
        app.post("/f", router.report.getReports);
        app.post("/fid", router.report.findByBeachId);
        app.post("/u", router.report.updateReport);
        
//End of default endpoints-------------------------/
    }
};

module.exports = _self;
