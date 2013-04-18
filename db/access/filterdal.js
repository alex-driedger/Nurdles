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
    }
};

module.exports = self;

