var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var oauth2orize = require('oauth2orize');


// Register the ensure authenticated function for use in routers.
global.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    return res.send("access denied");
};


function run (opts, processArgs) {
    
    // Create the application
    var app = express();
    var config = require('./config');

    // Connect to the database
    app.mongoose = mongoose;
    require('./config/mongoose')(app);

    // Load the models
    var path = __dirname + '/models';
    fs.readdirSync(path).forEach(function (filename) {
        if (filename.indexOf('.js') != -1)
            require(path + '/' + filename)(app);
    });

    // Seed the database
    require('./db')(app);

    // Configure the modules
    app.passport = passport;
    require('./config/passport')(app);
    app.oauth = oauth2orize.createServer();
    require('./config/oauth')(app);

    // Configure express
    app.use(express.bodyParser()),
    app.use(express.methodOverride());
    app.use(express.cookieParser("cookie"));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());

    // Support static content
    app.use(express.static(config.dirs.client));

    // Bind the routers
    var path = __dirname + '/routers';
    fs.readdirSync(path).forEach(function (filename) {
        if (filename.indexOf('.js') != -1)
            require(path + '/' + filename)(app);
    });

    var port = opts.port || config.ports.server;
    app.listen(port);

    console.log("INFO: Running server on:", port);

}

module.exports = {
    run: run
}

