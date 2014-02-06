module.exports = function (mongoose) {

    var ReportSchema = new mongoose.Schema({
            beachID: String,
            siteLocation: String,
            siteDescription: String,
            cleanUpSummary: String,
            cleanUpItems: String,
            itemsOfLocalConcern: String,
            peculiarItems: String,
            animalInjuries: String,
            hazardousDebris: String,
            // Everything below this and above created is not needed, instead uses item1 item2 etc because
            // the user can type it in himself instead of choosing from a list
            cigaretteButts: Number,
            foodWrappers: Number,
            plasticTakeOut: Number,
            foamTakeOut: Number,
            lids: Number,
            plasticCupsAndPlates: Number,
            foamCupsAndPlates: Number,
            paperCupsAndPlates: Number,
            cutlery: Number,
            motorOilBottles: Number,
            plasticBottles: Number,
            plasticWrap: Number,
            plastingStraps: Number,
            rubberStraps: Number,
            tobaccoWrap: Number,
            created: Date,
            updated: Date
    });
    // Convenience method for creating
    // Upon created a new report, EVERYTHING MUST BE FILLED. If there's nothing just leave a 0 or "" or something like that
    ReportSchema.statics.createReport = function(res, newReport)
    {
        newReport['created'] = new Date();
        newReport['updated'] = new Date();

        // Creating the Report using input data
        Report.create(newReport, function (err, newreport)
        {
            // Return a list of all reports
            Report.find(function (err, reports) {res.send(reports)})
        })
    }
    ReportSchema.statics.findByBeachId = function (res, id)
    {
        Report.find({beachID: id}, function(err, reports){
            res.send(reports)
        })
    }
    ReportSchema.statics.getReports = function(res)
    {
        Report.find({}, function(err, reports)
        {
            res.send(reports)
        })
    }
    ReportSchema.statics.clearReports = function(res)
    {
        Report.remove({},function(err,numAffected,raw)
            {
                console.log(numAffected)
                 Report.find(function (err, reports) {
                    res.send(reports)
                })
            }); 
    }
    // On save, update all values.
    ReportSchema.statics.updateReport = function (res, newReport)
    {
        // We will need to recieve an ID from the client if they are updating a report.
        // For now hardcode an example
        newReport['updated'] = new Date();
        Report.update({_id: "52efe1e7e768418afb9a97c2"}, newReport, function(err)
        {
            Report.find(function(err, reports) {res.send(reports)})
        })
    }





    var Report = mongoose.model("Report", ReportSchema);
    
    return Report;
    
};
