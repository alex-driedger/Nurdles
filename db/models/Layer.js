var mongoose = require('../index').getMongoose();

var LayerSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: false},
    url: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    authKey: { type: String, required: false },
    isExactEarth: { type: Boolean, required: true }
});

var Layer = mongoose.model("Layer", LayerSchema);

module.exports = {
    Layer: Layer
};


