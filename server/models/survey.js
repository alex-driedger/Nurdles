

/* 
Simple Survey example. 

Note: Survey is an acronym for Create Retrieve Update Delete, the four main actions performed on data.

This file should not be used in a production site, but is a template for similar functionality. 
*/
module.exports = function (mongoose) {
    
    var ObjectId = mongoose.Schema.ObjectId;

    var SurveySchema = new mongoose.Schema({
        beachID: String,
	    environment: String,
	   	beachtype: String,
		date: Date, 
	    weight: String,
	    area: String,
	    volunteers: Number,
	    bags: Number,
	    notes: String,
	    localConcern: String,
	    peculiarItems: String,
	    injuredAnimals: String,
	    hazardousDebris: String,
	    items: Array,
        created: Date
        // , mixed : Mixed // Not implemented because mixed types should be used sparingly, if at all.
    });

    var Survey = mongoose.model( 'Survey', SurveySchema);

    return Survey;
};
