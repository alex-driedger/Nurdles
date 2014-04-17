var path = require( 'path' ),
    mongoose = require( 'mongoose' ),
    survey = require( path.join( __dirname, '..', 'models', 'survey' ) ),
    Survey = mongoose.model( 'Survey' ),
    _ = require( 'underscore' );
    beach = require( path.join( __dirname, '..', 'models', 'beach' ) ),
    Beach = mongoose.model('Beach')
    nodemailer = require( 'nodemailer')
    use = require( path.join( __dirname, '..', 'models', 'user' ) ),
    User = mongoose.model('User')
var self = {
    sendLink: function( req, res)
    {
        var User = mongoose.model('User')
        User.findOne({_id: req.params.username}, function(err, data)
            {
                // target email
                username = data.username
                // This method will send an email to nurdlestestmail@gmail.com
                var smtpTransport = nodemailer.createTransport("SMTP",{
                    service: "Gmail",
                    auth: {
                        user: "nurdlestestmail@gmail.com",
                        pass: "Nurdles1"
                    }
                });
                var mailOptions = {
                    from: "Nurdles <nurdlestestmail@gmail.com>", // sender address
                    //  Send it to "username" which should be another email
                    to: username, // list of receivers
                    subject: "Data link for survey id" + req.params.id, // Subject line
                    text: "Here is a link to the survey download: http://localhost:4010/#data/"+req.params.id, // plaintext body
                    html: "<b><a href='http://caf-nurdles.herokuapp.com/#data/"+req.params.id+"'>Here</a> is a link to the survey download</b>" // html body
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                        res.send({email: username})
                    }
                })
            })
    },
    create: function( req, res ) {
           properties = {};
        if( _.has( req.body, 'beachID') && _.isString( req.body.beachID ) ) {
            properties.beachID = req.body.beachID;
        }
        if( _.has( req.body, 'environment') && _.isString( req.body.environment ) ) {
            properties.environment = req.body.environment;
        }
        if( _.has( req.body, 'beachType') && _.isString( req.body.beachType ) ) {
            properties.beachType = req.body.beachType;
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

        Beach.findOne({_id: req.body.beachID}, function (err, beach)
        {
            beach.lastUpdated = req.body.created
            console.log(beach)
        })
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
        id = req.params.id
        start = req.params.start
        start = new Date(start.slice(0,2) + "/" + start.slice(2,4) + "/" + start.slice(4,8))
        end = req.params.end
        end = new Date(end.slice(0,2) + "/" + end.slice(2,4) + "/" + end.slice(4,8))
        Survey.find({beachID: id}, function ( err, surveyCollection ) {
            if( null === err ) {
                validBeaches = []
                for (i in surveyCollection)
                {
                    // This sets the time form the date object to 0 so we can get surveys from the same date
                    d = surveyCollection[i].created
                    date = new Date(('0' + (d.getMonth()+1)).slice(-2) + '/' + ('0' + (d.getDate())).slice(-2) + '/' + d.getFullYear());
                    if (date >= start && date<= end)
                    {
                        validBeaches.push(surveyCollection[i])
                    }
                }
                res.send( validBeaches );

            } else {
                res.send( 500, err );
            }
        });
    },

    retrieveOne: function( req, res ) {
        Survey.findOne( { _id:req.params.id }, function( err, survey ) {
            if( null === err ) {
                res.send( survey );
            } else {
                res.send( 500, err );
            }
        });
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
                    survey.beachType = req.body.beachType || survey.beachType; 
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