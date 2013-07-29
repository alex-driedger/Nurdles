var mongooseInstance;

function createDb(mongoose, callback) {
    if (!mongoose)
        mongoose = require("mongoose");

    mongooseInstance = mongoose;

    //Heroku sets the process.env.PORT variable. If it's undefined, it means we're running locally
    //so connect to the local mongo instance.
    var connectionString = 
        process.env.MONGOLAB_URI || 
            process.env.MONGOHQ_URL || 
                'mongodb://localhost/frontier';

    var theport = process.env.PORT || 5000;
    var mongoOptions = { db: { safe: true }};

    mongoose.connect(connectionString,  mongoOptions);

    if (callback)
        callback(mongoose);
}

function getMongoose() {
    return mongooseInstance || require("mongoose");
}

module.exports = {
    createDb: createDb,
    getMongoose: getMongoose
};