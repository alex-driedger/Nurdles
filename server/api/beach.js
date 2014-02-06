var path = require("path");
var beach = require(path.join(__dirname, "..", "models", "beach"));
var mongoose = require("mongoose")
var self = {
    // CURRENTLY CASE SENSITIVE AND EVERYTHING MUST BE EXACT
/*{
  "beachname": "2asdD",
  "lat": 23,
  "lon": 43,
  "city": "CITYs",
  "state": "STATE",
  "country": "COUNTRY",
  "updated": "2014-01-31T14:19:36.000Z",
  "rating": 7

}*/

    createBeach: function(req, res) {
        var Beach = mongoose.model('Beach')
        console.log(req.body);
        Beach.createBeach(res, req.body)
    },
    displayBeaches: function(req, res) {
        var Beach = mongoose.model('Beach')
        Beach.displayBeaches(res)
    },
    findByName: function(req, res) {
        var Beach = mongoose.model('Beach')
        Beach.findByName(res, req.body.beachname)
    },
    findByAddress: function(req, res) {
        var Beach = mongoose.model('Beach')
        Beach.findByAddress(res, req.body.address, req.body.city, req.body.state, req.body.country)
    },
    findByGeolocation: function(req, res) {
        var Beach = mongoose.model('Beach')
        Beach.findByGeolocation(res, req.body.lat, req.body.lan)
    },
    clearDatabase: function(req, res) {
        var Beach = mongoose.model('Beach')
        Beach.clearDatabase(res)
    }
};

module.exports = self;
