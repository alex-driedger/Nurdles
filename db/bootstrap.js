
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            layerDAL = require("./access/layerdal");

        userDAL.create("chris", "password", "tokencoin", function(err, user) {
            
        });
    }
};
