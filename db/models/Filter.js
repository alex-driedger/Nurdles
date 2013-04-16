var mongoose = require('../index').getMongoose(),
    filterOperator = require('./FilterOperator').FilterOperator;

var FilterSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: false},
    operators: {type: String, operands: [filterOperator], required: true }
});

var Filter = mongoose.model("Filter", FilterSchema);

module.exports = {
    Filter: Filter
};

