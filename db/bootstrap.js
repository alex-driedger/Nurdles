
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal");

        userDAL.create("appsfactory", "appsfactory", "tokencoin", function(err, user) {
            if (user) {
                // Initialize user data here
            }
        });
    }
};