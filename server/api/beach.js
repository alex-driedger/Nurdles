var path = require( 'path' ),
    mongoose = require( 'mongoose' ),
    beach = require( path.join( __dirname, '..', 'models', 'beach' ) ),
    Beach = mongoose.model( 'Beach' ),
    survey = require( path.join( __dirname, '..', 'models', 'survey' ) ),
    Survey = mongoose.model( 'Survey' ),
    report = require( path.join( __dirname, '..', 'models', 'report' ) ),
    Report = mongoose.model( 'Report' ),
    rate = require( path.join( __dirname, '..', 'models', 'rate' ) ),
    Rate = mongoose.model( 'Rate' ),
    parseXlsx = require('excel'),
    beachDataPath = path.join(__dirname, '..', 'beachData', 'Ontario_Beaches_Sample_List.xlsx'),
    _ = require( 'underscore' );

var self = {
    prepareDatabase: function (req, res)
    {
        // Retrieve the beach data file
        parseXlsx(beachDataPath, function(err, data) {
            if(err)
            {
                console.log("ERROR");
            } else
            {
            function callback (updates)
                {
                    // If updates[i] is null, then it means it doesn't exist so create it
                    for (i in updates)
                    {
                        if (updates[i] == null)
                        {
                            // var properties is defined after this function sooo it might be safer to pass it in as a variable
                            beach = new Beach( properties[i] );
                            beach.save( function ( err, beach, numberAffected ) {
                                if( null === err ) {
                                    console.log(beach.beachName + " was created.")
                                    res.send( beach );
                                } else {
                                    res.send( 500, err );
                                }
                            });
                        }
                    }
                }
                var properties = []
                var updates = []
                // i = 0 would be the headers, we don't want the headers
                for (i = 1; i < data.length; i++)
                {
                    properties.push(
                    {
                        beachID:data[i][0],
                        beachName:data[i][1].toUpperCase(),
                        city:data[i][2].toUpperCase(),
                        state:data[i][3].toUpperCase(),
                        lat:data[i][4],
                        lon:data[i][5],
                        created: new Date()
                    })
                    Beach.findOne({beachID: data[i][0]}, function ( err, beachCollection ) {
                        if( null === err ) {
                            // Push the result of the search to updates (If it is not found, it's null)
                            updates.push(beachCollection)
                            // At the end of the loop, callback
                            if (updates.length == data.length-1)
                            {
                                callback(updates)
                            }
                        } else {
                            res.send( 500, err );
                        }
                    });
                    // Check if this beach already exists 
                }
            }
        });

    },
    find: function (req, res) {
        var limit = req.params.limit
        var data = new RegExp(req.params.data.toUpperCase())
        var temp = {}
        temp[req.params.attribute] = data
        console.log(temp)
        Beach
        .find (temp)
        .exec (function ( err, beachCollection ) {
            if( null === err ) {
                var possibleBeaches = []
                for (i in beachCollection)
                {
                    var path = eval("beachCollection[i]." + req.params.attribute);
                    if (path.slice(0,req.params.data.toUpperCase().length) == req.params.data.toUpperCase())
                    {
                        possibleBeaches.push(beachCollection[i])
                    }
                }
                if (limit == undefined)
                {
                    res.send((possibleBeaches).slice(0, 5));
                } else 
                {
                    res.send((possibleBeaches).slice(0,limit));
                }
            } else {
                res.send( 500, err );
            }
        });
    },

    create: function( req, res ) {
           properties = {};

        // Simple validation example, checks that a property 
        // exists and is of the right type. Deeper validation 
        // would, for example, validate that a field is an email address.
        // In most cases, we would also reject the creation if invalid 
        // data is included, here we just ignore it.
        if( _.has( req.body, 'beachID') && _.isNumber( req.body.beachID ) ) {
            properties.beachID = req.body.beachID;
        }
        if( _.has( req.body, 'beachName') && _.isString( req.body.beachName ) ) {
            properties.beachName = req.body.beachName;
        }
        if( _.has( req.body, 'created') ) {
            tmpDate = new Date( req.body.created );
            if( _.isDate( tmpDate ) ) {
                properties.created = tmpDate;
            }
        }
        if( _.has( req.body, 'lat') && _.isNumber( req.body.lat ) ) {
            properties.lat = req.body.lat;
        }
        if( _.has( req.body, 'lon') && _.isNumber( req.body.lon ) ) {
            properties.lon = req.body.lon;
        }
        if( _.has( req.body, 'city') && _.isString( req.body.city ) ) {
            properties.city = req.body.city;
        }
        if( _.has( req.body, 'state') && _.isString( req.body.state ) ) {
            properties.state = req.body.state;
        }
        if( _.has( req.body, 'country') && _.isString( req.body.country ) ) {
            properties.country = req.body.country;
        }
        if( _.has( req.body, 'lastUpdated') && _.isString( req.body.lastUpdated ) ) {
            properties.lastUpdated = req.body.lastUpdated;
        }
        if( _.has( req.body, 'address') && _.isString( req.body.address) ) {
            properties.address = req.body.address;
        }

        beach = new Beach( properties );

        beach.save( function ( err, beach, numberAffected ) {
            if( null === err ) {
                res.send( beach );
            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveAll: function( req, res ) {
        Beach.find( function ( err, beachCollection ) {
            if( null === err ) {
                res.send(beachCollection)
                //Beach.remove(function(err,res){console.log(res)})

            } else {
                res.send( 500, err );
            }
        });
    },
    getClosest: function (req, res) {
        // THIS IS OFF http://www.movable-type.co.uk/scripts/latlong.html 
        // THIS IS THE HAVERSINE FORMULA USED TO CALCULATE THE DISTANCE BETWEEN 2 POINTS ON A MAP
        /** Converts numeric degrees to radians */
        if (typeof(Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function() {
            return this * Math.PI / 180;
          }
        }
        distances = []
        Beach.find( function ( err, beachCollection ) {
            if( null === err ) {
            var collections = [];
            var R = 6371; // RADIUS OF EARTH IN KM
                    for (i in beachCollection)
                    {
                        var lat1 = parseFloat(req.params.lat);
                        var lon1 = parseFloat(req.params.lon);
                        var lat2 = beachCollection[i].lat;
                        var lon2 = beachCollection[i].lon;
                        var dLat = (lat2-lat1).toRad();
                        var dLon = (lon2-lon1).toRad();
                        var lat1 = lat1.toRad();
                        var lat2 = lat2.toRad();
                        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        distances.push(R * c);
                    }
                    for( i = 0; i < req.params.amount; i ++)
                    {
                        var index = distances.indexOf(Math.min.apply(Math, distances))
                        if (beachCollection[index] == undefined)
                        {
                            break;
                        }
                        temp = {}
                        temp = beachCollection[index]
                        temp.distance = distances[index]
                        temp.beachID = "ID"
                        console.log(temp.distance)
                        collections.push(beachCollection[index])
                        collections[i].distance = distances[index]
                        beachCollection.splice(index,1)
                        distances.splice(index,1)
                    }
                    res.send(collections)
            } else {
                res.send( 500, err );
            }
        });

},

    retrieveOne: function( req, res ) {
        Beach.findOne( { _id:req.params.id }, function( err, beach ) {
            if( null === err ) {
                res.send( beach );
            } else {
                res.send( 500, err );
            }
        });
    },

    update: function( req, res ) {
        // First find the existing document.
        Beach.findOne( { _id:req.params.id }, function( err, beach ) {
            if( null === err ) {
                // Test that the document was found.
                if( null === beach ) {
                    // Document was not found, send 404 - Not Found
                    res.send( 404 );
                } else {
                    // Update existing document with properties from the request,
                    // or with the existing value if the property is not in the request.
                    beach.beachID = req.body.beachID|| beach.beachID;
                    beach.beachName = req.body.beachName || beach.beachName;
                    beach.created = req.body.created || beach.created;
                    beach.lat = req.body.lat || beach.lat;
                    beach.lastUpdated = req.body.lastUpdated || beach.lastUpdated;
                    beach.lon = req.body.lon || beach.lon;
                    beach.city = req.body.city || beach.city;
                    beach.state = req.body.state || beach.state;
                    beach.country = req.body.country || beach.country;

                    beach.save( function ( err, updatedBeach ) {
                        if( null === err ) {
                            res.send( updatedBeach );
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
         Beach.remove( { _id:req.params.id }, function( err) {
            if( null === err ) {
                res.send( 200 );
            } else {
                res.send( 500, err );
            }
         });
    },

    recentSurveys: function( req, res ) {
        Survey.find( {beachID:req.params.id } )
            .sort({'created': -1})
            .limit(5)
            .exec (function( err, surveys ) {
            if( null === err ) {
                res.send( surveys );
            } else {
                res.send( 500, err );
            }
         });
    }, 

    recentReports: function( req, res ) {
        Report.find( {beachID:req.params.id } )
            .sort({'created': -1})
            .limit(5)
            .exec (function( err, reports ) {
            if( null === err ) {
                res.send( reports );
            } else {
                res.send( 500, err );
            }
         });
    },
    recentRates: function( req, res ) {

        var ratings = [0,0,0,0,0];
        var total = [0,0,0,0,0];
        Rate.find( {beachID:req.params.id } )
            .sort({'created': -1})
            .exec (function( err, rates ) {
            if( null === err ) {
                for (i in rates)
                {
                    if (rates[i].created+5 < new Date().getTime()/1000/60/60/24)
                    {
                        break;
                    }
                    for (j = 0; j < 5; j ++)
                    {
                        if (Math.floor(rates[i].created.getTime()/1000/60/60/24) == Math.floor(new Date().getTime()/1000/60/60/24)-j)
                        {
                            ratings[j]+=(rates[i].rating)
                            total[j]++;
                            break;
                        }
                    }
                }
                res.send( {ratings: ratings, total: total} );
            } else {
                res.send( 500, err );
            }
         });
    }
};

module.exports = self;