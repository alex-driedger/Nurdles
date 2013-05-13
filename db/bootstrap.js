
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            filterDAL = require("./access/filterdal");

        userDAL.create("chris", "password", function(err, user) { });
    }
};
