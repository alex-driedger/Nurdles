
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal");
        var clientDAL = require("./access/clientdal");

        userDAL.create("appsfactory", "appsfactory", "tokencoin", function(err, user) {
            if (user) {
                // Initialize user data here
            }
        });

        clientDAL.create("pattern", "secret", function(err, client) {
        	if (err) {
        		// Handle the error.
        		console.log(err);
        	}
        });
    }
};