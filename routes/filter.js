var filterdal = require('../db/access/filterdal.js');

var self = {
    getAllForUser: function(req, res) {
        filterdal.getAllForUser(req.user._id, function(err, filters) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else
                res.send(filters);
        });
    },

    create: function(req, res) {
        
    },

    delete: function(req, res) {
        
    },

    getById: function(req, res) {
        
    },

    update: function(req, res) {

    }

};

module.exports = self;


