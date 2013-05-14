
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            filterDAL = require("./access/filterdal");

        userDAL.create("chris", "password", "tokencoin", function(err, user) { });
    }
};
