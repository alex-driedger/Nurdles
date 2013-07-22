var Filter = require('../models/Filter').Filter,
    mongoose = require('../index').getMongoose();

var self = {
    create: function(userId, filter, callback) {
        var ObjectId = mongoose.Types.ObjectId;
        Filter.findOne({owner: ObjectId(userId.toString())}).sort({order: -1}).exec(function(err, maxFilter) {
            filter.owner = userId;
            if (maxFilter)
                filter.order = maxFilter.order + 1;
            else
                filter.order = 0;

            Filter.create(filter, function(err, filter) {
                callback(null, filter);
            });
        });
    },

    getAllForUser: function(id, callback) {
        var ObjectId = mongoose.Types.ObjectId;
        Filter.find({owner: new ObjectId(id.toString()), active: true}).sort({order: 1}).exec(function(err, filters) {
            Filter.find({owner: new ObjectId(id.toString()), active: false}).sort({order: 1}).exec(function(err, inactiveFilters) {
                for (var i = 0; i < inactiveFilters.length; i++) {
                    filters.push(inactiveFilters[i]);
                }
                callback(err, filters);
            });
        });
    },

    update: function(id, filter, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        
        delete filter._id; //Mongoose will not save it if it thinks it's updating the _id field
        delete filter._id;

        console.log("About to save: ", filter);
        Filter.update({_id: new ObjectId(id.toString())}, filter, {safe: true}, function(err, num, raw) {
            console.log("Error: ", err);
            console.log("Number affected: ", num);
            console.log("Raw: ", raw);
            callback(err, num);
        });
    },

    getById: function(id, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        Filter.findOne({_id: new ObjectId(id.toString())}, function(err, filter) {
            callback(err, filter);
        });
    },

    remove: function(filterId, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        Filter.remove(filterId, function(err) {
            callback(err);
        });
    },

};

module.exports = self;

