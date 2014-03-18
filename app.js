
var express = require('express'),
    serverConfiguration = require("./config/server.config");

var _self = {
    run: function(opts, params) {
        var app = express();
        serverConfiguration.configure(app, opts, params);
    }
};

module.exports = _self;
