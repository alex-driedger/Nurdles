var mongoose = require('../index').getMongoose();

var FilterOperatorSchema = new mongoose.Schema({
    type: { type: String, required: true},
    operands: {type: mongoose.Schema.Types.Mixed, required: true }
});

var FilterOperator = mongoose.model("FilterOperator", FilterOperatorSchema);

module.exports = {
    FilterOperator: FilterOperator
};

