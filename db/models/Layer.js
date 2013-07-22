var mongoose = require('../init').getMongoose();

var LayerSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true, default: "Default" },
    name: { type: String, required: false, default: "Default"},
    url: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    authKey: { type: String, required: false },
    isBaseLayer: { type: Boolean, required: true, default: false },
    isExactEarth: { type: Boolean, required: true, default: false },
    exactEarthLayerType: { type: String, required: false },
    exactEarthParams: { type: mongoose.Schema.Types.Mixed, required: false },
    exactEarthOptions: { type: mongoose.Schema.Types.Mixed, required: false },
    isLocked: {type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: false },
    order: { type: Number, required: true, default: -1 },
    mapType: { type: String, required: true, default: "WMS" },
    filters: {type: mongoose.Schema.Types.Mixed, required: true, default: {}}
});

var Layer = mongoose.model("Layer", LayerSchema);

module.exports = {
    Layer: Layer
};


