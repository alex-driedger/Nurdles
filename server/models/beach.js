module.exports = function (mongoose) {

    var BeachSchema = new mongoose.Schema({
        beachname: String,
        lat: Number,
        lon: Number,
        address: String,
        city: String,
        state: String,
        country: String,
        updated: Date
    });
    // Convenience method for creating
    // Create a new beach (all schema objects must be provided)
    BeachSchema.statics.createBeach = function (res, newBeach)
    {
        // Look for the beach
        Beach.findOne({beachname: newBeach.beachname},function (err,beach){
            // If it does not exist, create it
            if (beach == null)
            {
                // Creating the beach using input data
                Beach.create(newBeach, function (err, newbeach)
                {
                    // Return a list of all beaches
                    Beach.find(function (err, beaches) {res.send(beaches)})
                })
            } else
            {
                // return a list of all beaches
                Beach.find(function (err, beaches) {res.send(beaches)})
            }
        })
    }
    // find by beachname. must be exact
    BeachSchema.statics.findByName = function (res, beachname)
    {
        Beach.find({beachname: beachname},function (err, beach) {
            res.send(beach)
        })
    }
    // Find by address, city, state, country. All params must be provided, and provided exact (capitals etc)
    BeachSchema.statics.findByAddress = function (res, address, city, state, country)
    {
        Beach.find({address: address, city: city, state: state, country: country},function (err, beach) {
            res.send(beach)
        })
    }
    // THIS IS NOT WORKING
    BeachSchema.statics.findByGeolocation = function (lat, lon)
    {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.lat)
        })
    }
    BeachSchema.statics.clearDatabase = function (res)
    {
       Beach.remove({},function(err,numAffected,raw)
            {
                console.log(numAffected)
                 Beach.find(function (err, beaches) {
                    res.send(beaches)
                })
            }); 
    }
    BeachSchema.statics.displayBeaches = function (res)
    {
        // return a list of all beaches
        var Beach = mongoose.model('Beach')
        Beach.find(function (err, beaches) {res.send(beaches)})
    }



    var Beach = mongoose.model("Beach", BeachSchema);
    
    return Beach;
    
};
