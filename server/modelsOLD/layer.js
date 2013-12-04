var LayerSchema, Layer;
var path = require("path");
var mongoose = require(path.join("..", "..", "config", "db.config")).getMongoose();

var self = {
    init: function() {
        LayerSchema = new mongoose.Schema({
            owner: {type: mongoose.Schema.ObjectId, required: true },
            title: { type: String, required: true, default: "Default" },
            name: { type: String, required: false, default: "Default"},
            url: { type: String, required: false },
            username: { type: String, required: false },
            password: { type: String, required: false },
            authKey: { type: String, required: false },
            isBaseLayer: { type: Boolean, required: true, default: false },
            isExactEarth: { type: Boolean, required: true, default: false },
            exactEarthLayerType: { type: String, required: false }, //convenience attribute
            exactEarthLayerStyle: { type: String, required: false }, //convenience attribute
            exactEarthParams: { type: mongoose.Schema.Types.Mixed, required: false },
            exactEarthOptions: { type: mongoose.Schema.Types.Mixed, required: false },
            isLocked: {type: Boolean, required: true, default: false },
            active: { type: Boolean, required: true, default: false },
            order: { type: Number, required: true, default: -1 },
            mapType: { type: String, required: true, default: "WMS" },
            filter: {type: mongoose.Schema.Types.Mixed, required: true, default: {}}
        });

        Layer = mongoose.model("Layer", LayerSchema);
    },

    create: function(userId, layer, callback) {
        var Layer = mongoose.model("Layer");
        layer.owner = userId;
        Layer.create(layer, function(err, layer) {
            callback(null, layer);
        });
    },

    getAllForUser: function(id, callback) {
        var Layer = mongoose.model("Layer");
        var ObjectId = mongoose.Types.ObjectId;
        console.log("Finding Layers for user: ", id);
        Layer.find({owner: new ObjectId(id.toString())}).sort({order: 1}).exec(function(err, layers) {
            callback(err, layers);
        });
    },

    update: function(id, layer, callback) {
        var Layer = mongoose.model("Layer");
        var ObjectId = mongoose.Types.ObjectId;

        delete layer._id; //Mongoose will not save it if it thinks it's updating the _id field

        console.log("About to save: ", layer);
        Layer.update({_id: new ObjectId(id.toString())}, layer, function(err, layer) {
            callback(err, layer);
        });
    },

    remove: function(layerId, callback) {
        var Layer = mongoose.model("Layer");
        var ObjectId = mongoose.Types.ObjectId;

        Layer.remove({_id: new ObjectId(layerId.toString())}, function(err) {
            callback(err);
        });
    },

    setBaseLayer: function(userId, layerId, callback) {
        var Layer = mongoose.model("Layer");
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


