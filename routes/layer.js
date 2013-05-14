var layerdal = require('../db/access/layerdal.js');

var self = {
    getAllForUser: function(req, res) {
        layerdal.getAllForUser(req.user._id, function(err, layers) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(layers);
                console.log(layers);
            }
        });
    },

    create: function(req, res) {
        layerdal.create(req.user._id, req.body, function(err, layer) {
            if (err) {
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(layer);
            }
        });
    },

    remove: function(req, res) {
        console.log("About to remove: ", req.params.layerId);
        layerdal.remove(req.params.layerId, function(err) {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                res.send(true);
            }
        });
        
    },

    getById: function(req, res) {
        
    },

    update: function(req, res) {
        layerdal.update(req.params.layerId, req.body, function(err, layer) {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.send({error: err});
            }
            else {
                console.log(layer);
                res.send(layer);
            }
        });

    }

};

module.exports = self;



