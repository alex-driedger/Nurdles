var Filter = require('../models/Filter').Filter,
    User = require('../models/User').User,
    mongoose = require('../index').getMongoose();

var self = {
    saveFilterState: function(userId, activeFilters, callback) {
        var ObjectId = mongoose.Types.ObjectId;
        User.findById(new ObjectId(userId), function(err, user) {
            if (err)
                callback(err);
            else {
                user.activeFilters = activeFilters;
                user.save();
                callback(null, user.activeFilters);
            }
        });
    },

    getFilterState: function(userId, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        User.findById(new ObjectId(userId), function(err, user) {
            if (err)
                callback(err);
            else
                callback(null, user.activeFilters);
        });
    }
};

module.exports = self;

