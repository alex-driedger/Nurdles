var filterdal = require('../db/access/filterdal.js'),
    userdal = require('../db/access/userdal.js'),
    statedal = require('../db/access/statedal.js');

var self = {
    saveFilterState: function(req, res) {
        statedal.saveFilterState(req.user._id.toString(), req.body.activeFilters, function(err, response) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(response);
            }
        });
    }
};

module.exports = self;

