var mongoose = require('../init').getMongoose();

var FilterSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: false},
    active: { type: Boolean, required: true, default: false },
    topOperatorId: {type: Number, required: true, default: -1},
    topBinId: {type: Number, required: true, default: -1},
    isSubFilter: { type: Boolean, required: true, default: false },
    id: {type: Number, required: true, default: -1 },
    topLevelBin: {type: mongoose.Schema.Types.Mixed, required: true, default: {type: "&&", operators: []} },
    bins: {type: [mongoose.Schema.Types.Mixed], default: [] }
});

var Filter = mongoose.model("Filter", FilterSchema);

module.exports = {
    Filter: Filter
};

