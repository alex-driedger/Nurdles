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
    https = require('https')

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
                // CREATE A LIST OF EVERY BEACH IN THE FILE
                var properties = []
                var updates = []
                // i = 0 would be the headers, we don't want the headers
                for (i = 1; i < data.length; i++)
                {
                    properties.push(
                    {
                        beachID:data[i][0].trim(),
                        beachName:data[i][1].toUpperCase(),
                        city:data[i][2].toUpperCase(),
                        state:data[i][3].toUpperCase(),
                        country:"N/A",
                        lat:data[i][4],
                        lon:data[i][5],
                        created: new Date()
                    })
                }
                // OBTAIN THE LIST OF EVERY BEACH
                Beach.find(function(err, data)
                {
                    var id1 = []
                    // We want to compare ID so extract the ID and store it in a var
                    for ( i in data)
                    {
                        id1.push(data[i].beachID)
                    }
                    // For every beachID in the excel file
                    for (i in properties)
                    {
                        // If the beachID does not exist in the database
                        if (id1.indexOf(parseInt(properties[i].beachID)) == -1)
                        {
                            // save it
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
                })
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
           Beach.find(function(err, beachCollection)
           {
            var ID = []
            for(i in beachCollection)
            {
                ID.push(beachCollection[i].beachID)
            }
            if (ID != [])
            {
                ID = (Math.max.apply(Math,ID))+1
            } else
            {
                ID = 1;
            }
            console.log(ID)
        // Simple validation example, checks that a property 
        // exists and is of the right type. Deeper validation 
        // would, for example, validate that a field is an email address.
        // In most cases, we would also reject the creation if invalid 
        // data is included, here we just ignore it.
        properties.beachID = ID;
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

        beach = new Beach( properties );
        beach.save( function ( err, beach, numberAffected ) {
            if( null === err ) {
                res.send( beach );
            } else {
                res.send( 500, err );
            }
        });
    })
    },

    retrieveAll: function( req, res ) {
        Beach.find( function ( err, beachCollection ) {
            if( null === err ) {
                console.log(beachCollection)
                res.send(beachCollection)
                //Beach.remove(function(err,res){console.log(res)})

            } else {
                res.send( 500, err );
            }
        });
    },
        deleteAll: function( req, res ) {
        Beach.find( function ( err, beachCollection ) {
            if( null === err ) {
                Beach.remove(function(err,res){console.log(res)})

            } else {
                res.send( 500, err );
            }
        });
    },    getClosest: function (req, res) {
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
    getForecast: function (req, res)
    {
        var path = '/api/6093813dfdfae42b/forecast/q/'+req.params.lat+','+req.params.lon+'.json'
        var optionsget = {
            host : 'api.wunderground.com', // here only the domain name
            // (no http/https !)
            path : path, // the rest of the url with parameters if needed
            method : 'GET' // do GET
        };
        var request = https.request(optionsget, function(response) {
               response.on('data', function(data) {
                if(JSON.parse(data.toString()).response.error)
                {
                    res.send({message: JSON.parse(data.toString()).response.error.description})
                } else
                {
                    res.send(data.toString())
                }
                });
        });
        request.end();
    },
    retrieveOne: function( req, res ) {
        Beach.findOne( { _id:req.params.id }, function( err, beach ) {
            if( null === err ) {
                res.send(beach)
            } else {
                res.send( 500, err );
            }
        });
    },

    update: function( req, res ) {
        // First find the existing document.
        properties = {}
            if (req.body.beachName != '')
            {
                properties.beachName = req.body.beachName
            }
             if (req.body.city != '')
            {
                properties.city = req.body.city
            }
             if (req.body.state != '')
            {
                properties.state = req.body.state
            }
             if (req.body.country != '')
            {
                properties.country = req.body.country
            }
             if (req.body.lat != null)
            {
                properties.lat = req.body.lat
            }
            if (req.body.lon != null)
            {
                properties.lon = req.body.lon
            }
        Beach.update({_id: req.params.id}, properties,  function ( err, numAffected, updatedBeach ) {
            if( null === err ) {
                Beach.findOne({_id: req.params.id}, function (err, newBeach)
                {
                    console.log(newBeach)
                    res.send(newBeach)
                })
            } else {
                console.log(err)
                res.send( 500, err );
            }                
        });       
    },    

    destroy: function( req, res ) {
         Beach.remove( { _id:req.params.id }, function( err) {
            if( null === err ) {
                res.send({message: "Success"});
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