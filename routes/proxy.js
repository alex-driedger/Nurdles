var parser = require("xml2json");

var self = {
    proxyIt: function(req, res, passInfo, callback) {
        var https = require("follow-redirects").https;

        https.get(req.query["url"], function(response) {
            console.log("Starting proxy request!: ", req.query["url"]);
            var output = "";

            response.on("data", function(chunk) {
                output += chunk;
            });

            response.on("end", function() {
                if (passInfo)
                    callback(output);
                else
                    res.send(output);
            });
        });
    },

    defaultProxy: function(req, res) {
        self.proxyIt(req, res, true, function(output) {
            res.send(output);
        });
    },

    search: function(req, res) {
        var request = require('request');
        request.post({
            headers: {'content-type' : 'application/xml', 'content-length': req.xml.length},
            url:     "https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=exactAIS:LVI&authKey=tokencoin",
                body:    req.xml
        }, function(error, response, body){
            res.send(body);
        });
    },

    getFeatures: function(req, res) {
        self.proxyIt(req, res, true, function(output) {
            res.send(output);
        });
    },

    getCapabilities: function(req, res) {
        self.proxyIt(req, res, true, function(output) {
            var parsedResponse = parser.toJson(output);

            res.send(parser.toJson(output));
        });
    },

    getWMS: function(req, res) {
        var https = require("follow-redirects").https,
            params = "";

        for(var propertyName in req.query) {
            params += "&" + propertyName + "=" + req.query[propertyName];
        }

        https.get("https://owsdemo.exactearth.com/wms?authKey=tokencoin" + params, function(response) {
            var output = "";

            response.on("data", function(chunk) {
                output += chunk;
            });

            response.on("end", function() {
                res.send(output);
            });
        });
    }
};

module.exports = self;

