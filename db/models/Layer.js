var mongoose = require('../index').getMongoose();

var LayerSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    name: { type: String, required: false},
    url: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    authKey: { type: String, required: false },
    isBaseLayer: { type: String, required: true },
    isExactEarth: { type: Boolean, required: true },
    exactEarthParams: { type: mongoose.Schema.Types.Mixed, required: false },
    active: { type: Boolean, required: true, default: false }
});

var Layer = mongoose.model("Layer", LayerSchema);

module.exports = {
    Layer: Layer
};


