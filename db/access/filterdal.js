var Filter = require('../models/Filter').Filter,
    mongoose = require('../index').getMongoose();

var self = {
    create: function(filter, callback) {
        Filter.create(filter, function(err, filter) {
            callback(null, filter);
        });
    },

    getAllForUser: function(id) {
        var ObjectId = mongoose.Types.ObjectId;
        Filter.find(ObjectId(id), function(err, filters) {
            callback(err, filter);
        });
    }
};

module.exports = self;

