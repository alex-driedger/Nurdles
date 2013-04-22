var parser = require("xml2json");

var extractFilterFeatures = function(parsedResponse, callback) {
    var objectifyResponse = JSON.parse(parsedResponse.responseText);
};

var self = {
    proxyIt: function(req, res, passInfo, callback) {
        var https = require("follow-redirects").https;

        https.get(req.query["url"], function(response) {
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

    getFeatures: function(req, res) {
        self.proxyIt(req, res, true, function(output) {
            res.send(output);
        });
    },

    getCapabilities: function(req, res) {
        self.proxyIt(req, res, true, function(output) {
            var parsedResponse = parser.toJson(output);
                JSON.parse(parsedResponse.responseText);
            res.send(parser.toJson(output));
        });
    }
};

module.exports = self;

