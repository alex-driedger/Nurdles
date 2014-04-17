var path = require( 'path' ),
    mongoose = require( 'mongoose' ),
    rate = require( path.join( __dirname, '..', 'models', 'rate' ) ),
    Rate = mongoose.model( 'Rate' ),
    _ = require( 'underscore' );

var self = {
    create: function( req, res ) {
           properties = {};
        if( _.has( req.body, 'beachID') && _.isString( req.body.beachID ) ) {
            properties.beachID = req.body.beachID;
        }
        if( _.has( req.body, 'rating') && _.isNumber( req.body.rating ) ) {
            properties.rating = req.body.rating;
        }
        if( _.has( req.body, 'created') && _.isString( req.body.created ) ) {
            properties.created = req.body.created;
        }
        rate = new Rate( properties );
        rate.save( function ( err, rate, numberAffected ) {
            if( null === err ) {
                Beach.findOne({_id: req.body.beachID}, function (err, beach)
                    {
                        beach.lastUpdated = req.body.created
                        beach.lastRating = req.body.rating
                        beach.save();
                        res.send( rate );
                    })
            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveAll: function( req, res ) {
        Rate.find( function ( err, rateCollection ) {
            if( null === err ) {
                res.send( rateCollection );
            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveOne: function( req, res ) {
        Rate.findOne( { _id:req.params.id }, function( err, rate ) {
            if( null === err ) {
                res.send( rate );
            } else {
                res.send( 500, err );
            }
        });
    },

    update: function( req, res ) {
        // First find the existing document.
        Rate.findOne( { _id:req.params.id }, function( err, rate ) {
            if( null === err ) {
                // Test that the document was found.
                if( null === rate ) {
                    // Document was not found, send 404 - Not Found
                    res.send( 404 );
                } else {
                    // Update existing document with properties from the request,
                    // or with the existing value if the property is not in the request.
                    rate.beachID = req.body.beachID|| rate.beachID;
                    rate.rating = req.body.rating || rate.rating;
                    rate.created = req.body.created || rate.created;

                    rate.save( function ( err, updatedRate ) {
                        if( null === err ) {
                            res.send( updatedRate );
                        } else {
                            res.send( 500, err );
                        }                
                    });                    
                }
            } else {
                // An error occured retrieving the document.
                res.send( 500, err );
            }
        });
    },    

    delete: function( req, res ) {
         Rate.remove( { _id:req.params.id }, function( err) {
            if( null === err ) {
                res.send( 200 );
            } else {
                res.send( 500, err );
            }
         });
    },
};

module.exports = self;