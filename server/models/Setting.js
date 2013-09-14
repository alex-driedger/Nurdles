var mongoose = require('../init').getMongoose();

var SettingSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: false},
    value: {type: String, required: true }
});

var Setting = mongoose.model("Setting", SettingSchema);

module.exports = {
    Setting: Setting
};
