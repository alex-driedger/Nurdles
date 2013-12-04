var PolygonSchema, Polygon, mongoose;
var path = require("path");
var mongoose = require(path.join("..", "..", "config", "db.config")).getMongoose();

var self = {
    init: function() {
        PolygonSchema = new mongoose.Schema({
            owner: {type: mongoose.Schema.ObjectId, required: true },
            name: {type: String, required: true, default: "" },
            coordinates: {type: [mongoose.Schema.Types.Mixed], required: true, default: [] }
        });

        Polygon = mongoose.model("Polygon", PolygonSchema);
    },

    create: function(userId, polygon, callback) {
        var Polygon = mongoose.model("Polygon");
        polygon.owner = userId;
        Polygon.create(polygon, function(err, polygon) {
            callback(null, polygon);
        });
    },

    getAllForUser: function(id, callback) {
        var Polygon = mongoose.model("Polygon");
        var ObjectId = mongoose.Types.ObjectId;
        console.log("Finding Polygons for user: ", id);
        Polygon.find({owner: new ObjectId(id.toString())}).sort({name: -1}).exec(function(err, polygons) {
            callback(err, polygons);
        });
    },

    update: function(id, polygon, callback) {
        var Polygon = mongoose.model("Polygon");
        var ObjectId = mongoose.Types.ObjectId;

        delete polygon._id; //Mongoose will not save it if it thinks it's updating the _id field

        console.log("About to save: ", polygon);
        Polygon.update({_id: new ObjectId(id.toString())}, polygon, function(err, numberOfPolygons) {
            callback(err, numberOfPolygons);
        });
    },

    remove: function(polygonId, callback) {
        var Polygon = mongoose.model("Polygon");
        var ObjectId = mongoose.Types.ObjectId;

        Polygon.remove({_id: new ObjectId(polygonId.toString())}, function(err) {
            callback(err);
        });
    }
};

module.exports = self;


