var mongooseInstance;

var _self = {
    createDb: function () {
        mongooseInstance = require("mongoose");

        //Heroku sets the process.env.PORT variable. If it's undefined, it means we're running locally
        //so connect to the local mongo instance.
        var connectionString = 
            process.env.MONGOLAB_URI || 
                process.env.MONGOHQ_URL || 
                    'mongodb://localhost/pattern';

        var mongoOptions = { db: { safe: true }};
        mongooseInstance.connect(connectionString,  mongoOptions);

        return mongooseInstance;
    },

    configureMongooseModels: function(dir, db) {
        var fs = require('fs');
        var files = fs.readdirSync(dir);

        files.forEach(function (file) {
            if (file != ".DS_Store")
            {
                require(dir + "/" + file)(db);
            }
        });
    },

    seed: function(db) {
        var User = mongooseInstance.model("User");
        User.register({username: "admin", admin: true}, "admin", function(err, user) { });
        User.register({username: "appsfactory" }, "appsfactory", function(err, user) { });
    },

    getMongoose: function() {
        return mongooseInstance || require("mongoose");
    }
};

module.exports = _self;
