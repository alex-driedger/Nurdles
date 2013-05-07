var Filter = require('../models/Filter').Filter,
    mongoose = require('../index').getMongoose();

var self = {
    create: function(userId, filter, callback) {
        filter.owner = userId;
        Filter.create(filter, function(err, filter) {
            callback(null, filter);
        });
    },

    getAllForUser: function(id, callback) {
        var ObjectId = mongoose.Types.ObjectId;
        Filter.find({owner: new ObjectId(id.toString())}, function(err, filters) {
            callback(err, filters);
        });
    },

    update: function(id, filter, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        delete filter._id; //Mongoose will not save it if it thinks it's updating the _id field

        console.log("About to save: ", filter);
        Filter.update({_id: new ObjectId(id.toString())}, filter, function(err, filter) {
            callback(err, filter);
        });
    }

};

module.exports = self;

