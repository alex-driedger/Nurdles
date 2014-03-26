var path = require( 'path' ),
    mongoose = require( 'mongoose' ),
    survey = require( path.join( __dirname, '..', 'models', 'survey' ) ),
    Survey = mongoose.model( 'Survey' ),
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
        if( _.has( req.body, 'beachID') && _.isString( req.body.beachID ) ) {
            properties.beachID = req.body.beachID;
        }
        if( _.has( req.body, 'environment') && _.isString( req.body.environment ) ) {
            properties.environment = req.body.environment;
        }
        if( _.has( req.body, 'collectionMethod') && _.isString( req.body.collectionMethod ) ) {
            properties.collectionMethod = req.body.collectionMethod;
        }
        if( _.has( req.body, 'date') ) {
            tmpDate = new Date( req.body.date );
            if( _.isDate( tmpDate ) ) {
                properties.date = tmpDate;
            }
        }        
        if( _.has( req.body, 'notes') && _.isString( req.body.notes ) ) {
            properties.notes = req.body.notes;
        }
        if( _.has( req.body, 'localConcern') && _.isString( req.body.localConcern ) ) {
            properties.localConcern = req.body.localConcern;
        }
        if( _.has( req.body, 'peculiarItems') && _.isString( req.body.peculiarItems ) ) {
            properties.peculiarItems = req.body.peculiarItems;
        }
        if( _.has( req.body, 'injuredAnimals') && _.isString( req.body.injuredAnimals ) ) {
            properties.injuredAnimals = req.body.injuredAnimals;
        }
        if( _.has( req.body, 'hazardousDebris') && _.isString( req.body.hazardousDebris ) ) {
            properties.hazardousDebris = req.body.hazardousDebris;
        }
        if( _.has( req.body, 'weight') && _.isString( req.body.weight ) ) {
            properties.weight = req.body.weight;
        }
        if( _.has( req.body, 'area') && _.isString( req.body.area ) ) {
            properties.area = req.body.area;
        }
        if( _.has( req.body, 'volunteers') && _.isNumber( req.body.volunteers ) ) {
            properties.volunteers = req.body.volunteers;
        }
        if( _.has( req.body, 'bags') && _.isNumber( req.body.bags ) ) {
            properties.bags = req.body.bags;
        }
        if( _.has( req.body, 'created') ) {
            tmpDate = new Date( req.body.created );
            if( _.isDate( tmpDate ) ) {
                properties.created = tmpDate;
            }
        }
        if( _.has( req.body, 'items') && _.isArray( req.body.items ) ) {
            properties.items = req.body.items;
        }


        survey = new Survey( properties );

        survey.save( function ( err, survey, numberAffected ) {
            if( null === err ) {
                res.send( survey );
            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveAll: function( req, res ) {
        Survey.find( function ( err, surveyCollection ) {
            if( null === err ) {
                res.send( surveyCollection );
                //Survey.remove(function(err,res){console.log(res)})

            } else {
                res.send( 500, err );
            }
        });
        console.log("RETRIEVE ALL SURVEYS (This needs to go as retrieve all might pose memory problems for a phone)")
    },

    retrieveOne: function( req, res ) {
        Survey.findOne( { _id:req.params.id }, function( err, survey ) {
            if( null === err ) {
                res.send( survey );
            } else {
                res.send( 500, err );
            }
        });
        console.log("A SINGLE SURVEY WAS ACQUIRED")
    },

    update: function( req, res ) {
        // First find the existing document.
        Survey.findOne( { _id:req.params.id }, function( err, survey ) {
            if( null === err ) {
                // Test that the document was found.
                if( null === survey ) {
                    // Document was not found, send 404 - Not Found
                    res.send( 404 );
                } else {
                    // Update existing document with properties from the request,
                    // or with the existing value if the property is not in the request.
                    survey.collectionMethod = req.body.collectionMethod || survey.collectionMethod; 
                    survey.date = req.body.date || survey.date;
                    survey.weight = req.body.weight || survey.weight;
                    survey.area = req.body.area || survey.area;
                    survey.volunteers = req.body.volunteers || survey.volunteers;
                    survey.bags = req.body.bags || survey.bags;
                    survey.notes = req.body.notes || survey.notes;
                    survey.localConcern = req.body.localConcern || survey.localConcern;
                    survey.peculiarItems = req.body.peculiarItems || survey.peculiarItems;
                    survey.injuredAnimals = req.body.injuredAnimals || survey.injuredAnimals;
                    survey.hazardousDebris = req.body.hazardousDebris || survey.hazardousDebris; 
                    survey.items = req.body.items || survey.items; 
                    survey.created = req.body.created || survey.created;
                    survey.save( function ( err, updatedSurvey ) {
                        if( null === err ) {
                            res.send( updatedSurvey );
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
         Survey.remove( { _id:req.params.id }, function( err) {
            if( null === err ) {
                res.send( 200 );
            } else {
                res.send( 500, err );
            }
         });
         console.log("DELETED")
    },
};

module.exports = self;