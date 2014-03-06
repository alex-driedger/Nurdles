var path = require( 'path' ),
    mongoose = require( 'mongoose' ),
    report = require( path.join( __dirname, '..', 'models', 'report' ) ),
    Report = mongoose.model( 'Report' ),
    _ = require( 'underscore' );

var self = {

    /*
    Sample data:

    { 
      "string": "This is a sample string.",
      "number": 1,
      "date": "Tue Feb 11 2014 13:59:04 GMT-0500 (EST)",
      "buffer": "ASDF3R234SDF3432DSR324R23WEFD234RSDF23WE",
      "bool": true,
      "objectId": "507f1f77bcf86cd799439011",
      "array": [1,2,3]
    }
    */
    create: function( req, res ) {
           properties = {};

        // Simple validation example, checks that a property 
        // exists and is of the right type. Deeper validation 
        // would, for example, validate that a field is an email address.
        // In most cases, we would also reject the creation if invalid 
        // data is included, here we just ignore it.
        if( _.has( req.body, 'items') && _.isArray( req.body.items ) ) {
            properties.items = req.body.items;
        }
        if( _.has( req.body, 'beachID') && _.isString( req.body.beachID ) ) {
            properties.beachID = req.body.beachID;
        }
        if( _.has( req.body, 'comments') && _.isString( req.body.comments ) ) {
            properties.comments = req.body.comments;
        }
        if( _.has( req.body, 'created') ) {
            tmpDate = new Date( req.body.created );
            if( _.isDate( tmpDate ) ) {
                properties.created = tmpDate;
            }
        }

        report = new Report( properties );

        report.save( function ( err, report, numberAffected ) {
            if( null === err ) {
                res.send( report );
            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveAll: function( req, res ) {
        Report.find( function ( err, reportCollection ) {
            if( null === err ) {
                res.send( reportCollection );
                //Report.remove(function(err,res){console.log(res)})

            } else {
                res.send( 500, err );
            }
        });
        console.log("RETRIEVEALL")
    },

    retrieveOne: function( req, res ) {
        Report.findOne( { _id:req.params.id }, function( err, report ) {
            if( null === err ) {
                res.send( report );
            } else {
                res.send( 500, err );
            }
        });
        console.log("RETRIEVED REPORT")
    },

    update: function( req, res ) {
        // First find the existing document.
        Report.findOne( { _id:req.params.id }, function( err, report ) {
            if( null === err ) {
                // Test that the document was found.
                if( null === report ) {
                    // Document was not found, send 404 - Not Found
                    res.send( 404 );
                } else {
                    // Update existing document with properties from the request,
                    // or with the existing value if the property is not in the request.
                    report.items = req.body.items|| report.items;
                    report.beachID = req.body.beachID || report.beachID;
                    report.comments = req.body.comments || report.comments;
                    report.created = req.body.created || report.created;

                    report.save( function ( err, updatedReport ) {
                        if( null === err ) {
                            res.send( updatedReport );
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
         Report.remove( { _id:req.params.id }, function( err) {
            if( null === err ) {
                res.send( 200 );
            } else {
                res.send( 500, err );
            }
         });
    },
};

module.exports = self;