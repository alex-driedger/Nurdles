var mongoose = require('../init').getMongoose();

var FilterSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: false},
    active: { type: Boolean, required: true, default: false },
    operators: {type: mongoose.Schema.Types.Mixed, required: true },
    isSubFilter: { type: Boolean, required: true, default: false },
    order: {type: Number, required: true, default: -1 },
    logicalOperator: { type: String, required: true, default: "&&" }
});

var Filter = mongoose.model("Filter", FilterSchema);

module.exports = {
    Filter: Filter
};

