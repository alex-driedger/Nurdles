var filterdal = require('../db/access/filterdal.js');

var self = {
    getAllForUser: function(req, res) {
        filterdal.getAllForUser(req.user._id, function(err, filters) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(filters);
                console.log(filters);
            }
        });
    },

    create: function(req, res) {
        filterdal.create(req.user._id, req.body, function(err, filter) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(filter);
            }
        });
    },

    delete: function(req, res) {
        
    },

    getById: function(req, res) {
        
    },

    update: function(req, res) {
        filterdal.update(req.params.filterId, req.body, function(err, filter) {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                console.log(filter);
                res.send(filter);
            }
        });

    }

};

module.exports = self;


