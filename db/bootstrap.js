
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            filterDAL = require("./access/filterdal");

        userDAL.create("chris", "password", function(err, user) {
            filterDAL.create({
                owner: user._id,
                name: "Sample",
                operators: [
                    {
                        type: "sog",
                        operator: "..",
                        lowerBoundary: 10,
                        upperBoundary: 11 
                    }
                ]
            }, function(err, filter) {
                user.filters.push(filter);
                user.save();
                if (err)
                    console.log("ERROR CREATING FILTER: ", err);
            });
        });
    }
};
