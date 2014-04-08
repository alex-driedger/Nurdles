

/* 
Simple Beach example. 

Note: Beach is an acronym for Create Retrieve Update Delete, the four main actions performed on data.

This file should not be used in a production site, but is a template for similar functionality. 
*/
module.exports = function (mongoose) {
    
    var ObjectId = mongoose.Schema.ObjectId;

    var BeachSchema = new mongoose.Schema({
        beachID: Number,
        beachName: String,
        city: String,
        state: String,
        country: String,
        lat: Number,
        lon: Number,
        lastUpdated: Date,
        lastRating: Number,
        created: Date,
        grooming: String
        // , mixed : Mixed // Not implemented because mixed types should be used sparingly, if at all.
    });

    var Beach = mongoose.model( 'Beach', BeachSchema);

    return Beach;
};
