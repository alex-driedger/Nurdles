

/* 
Simple Rate example. 

Note: Rate is an acronym for Create Retrieve Update Delete, the four main actions performed on data.

This file should not be used in a production site, but is a template for similar functionality. 
*/
module.exports = function (mongoose) {
    
    var ObjectId = mongoose.Schema.ObjectId;

    var ReportSchema = new mongoose.Schema({
        items: Array,
        beachID: String,
        cleaned: Boolean,
        comments: String,
        rating: Number,
        image: String,
        created: Date
        // , mixed : Mixed // Not implemented because mixed types should be used sparingly, if at all.
    });

    var Report = mongoose.model( 'Report', ReportSchema);

    return Report;
};
