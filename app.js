var express = require('express'),
    routes = require('./routes'),
    conf = require('./conf'),
    db = require('./db'),
    repl = require('repl'),
    passport = require('passport'),
    utils = require('connect').utils, 
    parser = require('xml2js');

function xmlBodyParser(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();

    // check Content-Type
    if ('application/xml' != utils.mime(req)) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){  
        parser.parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                req.xml = buf;
                next();
            }
        });
    });
}

function run(opts) {
    var app = express(),
        port = opts.port || conf.ports.server;
       
    app.configure(function() {
        app.use(xmlBodyParser),
        app.use(express.bodyParser()),
        app.use(express.static(conf.dirs.client));
        app.use(express.methodOverride());
        app.use(express.cookieParser("clubsandwichofpain"));
        app.use(express.session());
        app.use(passport.initialize());
        app.use(passport.session());

        db.init(passport);
        routes.bind(app, passport);
    });
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
}

module.exports = {
    run: run
};;
