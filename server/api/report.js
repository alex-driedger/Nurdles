var path = require("path");
var beach = require(path.join(__dirname, "..", "models", "report"));
var mongoose = require("mongoose")
var self = {
    // CURRENTLY CASE SENSITIVE AND EVERYTHING MUST BE EXACT


    createReport: function(req, res) {
        // YOU ALSO WANT SOME KIND OF BEACH ID TO WORK WITH WHICH CORRESPONDS TO THE BEACH ID
        var Report = mongoose.model('Report')
        Report.createReport(res, req.body)
    },
    clearReports: function(req, res) {
        var Report = mongoose.model('Report')
        Report.clearReports(res);
    },
    findByBeachId: function(req, res) {
        var Report = mongoose.model('Report')
        // NEED AN ACTUAL ID
        Report.findByBeachId(res, "1")
    },
    getReports: function(req, res) {
        var Report = mongoose.model('Report')
        Report.getReports(res)
    },
    updateReport: function(req, res) {
        var Report = mongoose.model('Report')
        Report.updateReport(res, req.body)
    }
};

module.exports = self;
