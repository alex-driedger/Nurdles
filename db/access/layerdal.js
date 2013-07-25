var Layer = require('../models/Layer').Layer,
    mongoose = require('../index').getMongoose();

var self = {
    create: function(userId, layer, callback) {
        layer.owner = userId;
        Layer.create(layer, function(err, layer) {
            callback(null, layer);
        });
    },

    getAllForUser: function(id, callback) {
        var ObjectId = mongoose.Types.ObjectId;
        console.log("Finding Layers for user: ", id);
        Layer.find({owner: new ObjectId(id.toString())}).sort({order: 1}).exec(function(err, layers) {
            callback(err, layers);
        });
    },

    update: function(id, layer, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        delete layer._id; //Mongoose will not save it if it thinks it's updating the _id field

        console.log("About to save: ", layer);
        Layer.update({_id: new ObjectId(id.toString())}, layer, function(err, layer) {
            callback(err, layer);
        });
    },

    remove: function(layerId, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        Layer.remove({_id: new ObjectId(layerId.toString())}, function(err) {
            callback(err);
        });
    },

    setBaseLayer: function(userId, layerId, callback) {
        var ObjectId = mongoose.Types.ObjectId;

        Layer.update({
            owner: new ObjectId(userId.toString()),
            _id: {
                $ne: new ObjectId(layerId.toString())
            },
            isBaseLayer: true
        },
            {
                $set: {
                    active: false
                }
            }, function(err) {
                callback(err);
            }
        );
    }
};

module.exports = self;


