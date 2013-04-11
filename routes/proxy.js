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
                try {
                    console.log("trying to parse json");
                    console.log(output);
                    var jsonOutput = xmlParser.toJson(output);
                    jsonOutput.isJson = true;
                    console.log(jsonOutput);
                    res.send(output);
                } catch (e) {
                    console.log("Failed!", e);
                    res.send(output);
                }
            });
        });
    }

};

module.exports = self;

