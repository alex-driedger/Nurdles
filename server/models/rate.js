

/* 
Simple Rate example. 

Note: Rate is an acronym for Create Retrieve Update Delete, the four main actions performed on data.

This file should not be used in a production site, but is a template for similar functionality. 
*/
module.exports = function (mongoose) {
    
    var ObjectId = mongoose.Schema.ObjectId;

    var RateSchema = new mongoose.Schema({
        beachID: String,
        rating: Number,
        created: Date
        // , mixed : Mixed // Not implemented because mixed types should be used sparingly, if at all.
    });

    var Rate = mongoose.model( 'Rate', RateSchema);

    return Rate;
};
