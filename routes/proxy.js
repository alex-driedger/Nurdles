var self = {
    proxyIt: function(req, res) {
        var https = require("follow-redirects").https,
            xmlParser = require("xml2json");

        https.get(req.query["url"], function(response) {
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

