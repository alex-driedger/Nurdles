var express = require('express'),
    api = require('./api'),
    conf = require('./conf'),
    db = require('./db'),
    passport = require('passport'),
    utils = require('connect').utils, 
    parser = require('xml2js');

function run(opts) {
    var app = express(),
        port = opts.port || conf.ports.server;
       
    app.configure(function() {
        app.use(express.bodyParser()),
        app.use(express.static(conf.dirs.client));
        app.use(express.methodOverride());
        app.use(express.cookieParser("appsfactorypatternsecret"));
        app.use(express.session());
        app.use(passport.initialize());
        app.use(passport.session());

        db.init(passport);
        api.bindRoutes(app, passport);
    });
    app.listen(port);

    console.log("INFO: Running server on:", port);
}

module.exports = {
    run: run
};