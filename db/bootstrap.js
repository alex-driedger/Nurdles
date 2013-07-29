
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal");

        userDAL.create("chris", "password", "tokencoin", function(err, user) {
            if (user) {
                // Initialize user data here
            }
        });
    }
};