var path = require('path'),
    mongoose = require('mongoose'),
    beach = require(path.join(__dirname, '..', 'models', 'beach')),
    Beach = mongoose.model('Beach'),
    survey = require(path.join(__dirname, '..', 'models', 'survey')),
    Survey = mongoose.model('Survey'),
    rate = require(path.join(__dirname, '..', 'models', 'rate')),
    Rate = mongoose.model('Rate'),
    parseXlsx = require('excel'),
    // This is where we select where the beachData is coming from
    beachDataPath = path.join(__dirname, '..', 'beachData', 'Sample Beach List_4-3-2014.xlsx'),
    _ = require('underscore');
https = require('https')

var self = {
    prepareDatabase: function (req, res) {
        // Retrieve the beach data file
        parseXlsx(beachDataPath, function (err, data) {
            if (err) {
                console.log("ERROR");
            } else {
                // Create an array of every beach in the file
                var properties = []
                // i = 0 would be the headers, we don't want the headers therefore i=1
                for (i = 1; i < data.length; i++) {
                    // data is what we're getting from the file
                    // push beach data to properties
                    properties.push({
                        beachName: data[i][1].toUpperCase(),
                        city: "N/A",
                        state: data[i][10].toUpperCase(),
                        country: data[i][11].toUpperCase(),
                        grooming: data[i][9].toUpperCase(),
                        lat: parseFloat(data[i][12]),
                        lon: parseFloat(data[i][13]),
                        created: new Date(),
                        lastUpdated: new Date()
                    })
                }
                cur = 0;
                total = 0;
                possibleBeaches = []
                numUpdated = 0;
                numCreated = 0;
                // check if data is not in the array
                function notcontains(data, array) {
                    for (i in array) {
                        if (data == array[i]) {
                            return false
                        }

                    }
                    return true
                }

                Beach.find(function (err, data) {
                    // for every beach in our file
                    for (i in properties) {
                        total++;
                        // Check if there is a beach in the database
                        Beach.findOne({
                            lat: properties[i].lat,
                            lon: properties[i].lon
                        }, function (err, beach) {
                                // If a beach exists in the database with the files lat and lon
                            if (beach != null) {
                                // then add it to possible beaches
                                possibleBeaches.push(JSON.stringify([beach.lat, beach.lon]))
                            }
                            cur++;
                            // Beach.findOne is asynchronous. We want to run this if statement at the end of the for loop after
                            // Beach.findOne is complete. Therefore using 2 variables like cur and total (One in the asynch
                            // function and one outside) allows us to do stuff at the end.
                            if (total == cur) {
                                cur = 0;
                                total = 0;
                                // For every beach in the file
                                for (j in properties) {
                                    // if the beach in the file is NOT in the database 
                                    if (notcontains(JSON.stringify([properties[j].lat, properties[j].lon]), possibleBeaches)) {
                                        total++;
                                        beach = new Beach(properties[j]);
                                        // then add it to the database
                                        beach.save(function (err, beach, numberAffected) {
                                            if (null === err) {
                                                cur++;
                                                numCreated++;
                                                // at the end of the saves, find all the new added/possibly updates beaches
                                                // and send it back to the client
                                                if (cur == total) {
                                                    Beach.find(function (err, data) {
                                                        res.send({
                                                            message: numCreated + " beaches have been created. " + numUpdated + " beaches have been updated.",
                                                            data: data
                                                        })

                                                    })
                                                }
                                            } else {
                                                console.log(err)
                                            }
                                        });
                                    } else {
                                        // we start by deleting properties[j].created because the beach is not created
                                        // it's updated.
                                        delete properties[j].created
                                        total++;
                                        // update the beach at this lat/lon with properties
                                        Beach.update({
                                            lat: properties[j].lat,
                                            lon: properties[j].lon
                                        }, properties[j], function (err, numAffected, updated) {
                                            if (null === err) {
                                                cur++;
                                                numUpdated++;
                                                if (cur == total) {
                                                    Beach.find(function (err, data) {
                                                        res.send({
                                                            message: numCreated + " beaches have been created. " + numUpdated + " beaches have been updated.",
                                                            data: data
                                                        })
                                                    })
                                                }
                                            } else {
                                                console.log(err)
                                                res.send(500, err);
                                            }
                                        });
                                    }
                                }
                            }
                        })
                    }
                })

            }

        })
    },
    find: function (req, res) {
        // find is used to get beaches for the autocorrect
        // limit is the max number of beaches returned
        var limit = req.params.limit
        // data is what the input was (So if I type w into the text field this will look for anything 
        // that starts with "W")
        var data = new RegExp(req.params.data.toUpperCase())
        // temp has a key of the attribute we are looking for with the value of data
        // so for most autocompletes, it would be {beachName: /data/}
        var temp = {}
        temp[req.params.attribute] = data
        Beach
        // find a beach that has the letters from data in it (So if i search for w it can return WATER BEACH or even
        // OISDAHDOW BEACH because they both have w in it.
            .find(temp)
            // exec is callback
            .exec(function (err, beachCollection) {
                if (null === err) {
                    // this is the method used to find the beaches that will work
                    var possibleBeaches = []
                    for (i in beachCollection) {
                        // path is beachcollection[i]. whatever attribute we are autocompleting with
                        var path = eval("beachCollection[i]." + req.params.attribute);
                        // path[0,the length of the input] == input then it means the attribute has the same
                        // first few letters as data.
                        if (path.slice(0, req.params.data.toUpperCase().length) == req.params.data.toUpperCase()) {
                            possibleBeaches.push(beachCollection[i])
                        }
                    }
                    if (limit == undefined) {
                        res.send((possibleBeaches).slice(0, 5));
                    } else {
                        res.send((possibleBeaches).slice(0, limit));
                    }
                } else {
                    res.send(500, err);
                }
            });
    },

    create: function (req, res) {
        properties = {};
        if (_.has(req.body, 'beachName') && _.isString(req.body.beachName)) {
            properties.beachName = req.body.beachName.toUpperCase();
        }
        if (_.has(req.body, 'created')) {
            tmpDate = new Date(req.body.created);
            if (_.isDate(tmpDate)) {
                properties.created = tmpDate;
            }
        }
        if (_.has(req.body, 'lastUpdated')) {
            tmpDate = new Date(req.body.lastUpdated);
            if (_.isDate(tmpDate)) {
                properties.lastUpdated = tmpDate;
            }
        }
        if (_.has(req.body, 'lastUpdated') && _.has(req.body, 'created')) {
            tmpDate = new Date(req.body.created);
            if (_.isDate(tmpDate)) {
                properties.lastUpdated = tmpDate;
            }
        }
        if (_.has(req.body, 'lat') && _.isNumber(req.body.lat)) {
            properties.lat = req.body.lat;
        }
        if (_.has(req.body, 'lon') && _.isNumber(req.body.lon)) {
            properties.lon = req.body.lon;
        }
        if (_.has(req.body, 'city') && _.isString(req.body.city)) {
            properties.city = req.body.city.toUpperCase();
        }
        if (_.has(req.body, 'state') && _.isString(req.body.state)) {
            properties.state = req.body.state.toUpperCase();
        }
        if (_.has(req.body, 'grooming') && _.isString(req.body.grooming)) {
            properties.grooming = req.body.grooming.toUpperCase();
        }

        beach = new Beach(properties);
        beach.save(function (err, beach, numberAffected) {
            if (null === err) {
                res.send(beach);
            } else {
                res.send(500, err);
            }
        });
    },

    retrieveAll: function (req, res) {
        Beach.find(function (err, beachCollection) {
            if (null === err) {
                res.send(beachCollection)
            } else {
                res.send(500, err);
            }
        });
    },
    deleteAll: function (req, res) {
        // CAREFUL. THIS WILL NOT DELETE ASSOCIATED REPORTS/SURVEYS
        Beach.find(function (err, beachCollection) {
            if (null === err) {
                Beach.remove(function (err, res) {
                    console.log(res)
                })

            } else {
                res.send(500, err);
            }
        });
    },
    getClosest: function (req, res) {
        // THIS IS FROM http://www.movable-type.co.uk/scripts/latlong.html 
        // THIS IS THE HAVERSINE FORMULA USED TO CALCULATE THE DISTANCE BETWEEN 2 POINTS ON A MAP
        /** Converts numeric degrees to radians */
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }
        distances = []
        Beach.find(function (err, beachCollection) {
            if (null === err) {
                var collections = [];
                var R = 6371; // RADIUS OF EARTH IN KM
                for (i in beachCollection) {
                    var lat1 = parseFloat(req.params.lat);
                    var lon1 = parseFloat(req.params.lon);
                    var lat2 = beachCollection[i].lat;
                    var lon2 = beachCollection[i].lon;
                    var dLat = (lat2 - lat1).toRad();
                    var dLon = (lon2 - lon1).toRad();
                    var lat1 = lat1.toRad();
                    var lat2 = lat2.toRad();
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    distances.push(R * c);
                }
                for (i = 0; i < req.params.amount; i++) {
                    var index = distances.indexOf(Math.min.apply(Math, distances))
                    // once we have all the beaches, stop searching
                    if (beachCollection[index] == undefined) {
                        break;
                    }
                    temp = {}
                    temp = beachCollection[index]
                    temp.distance = distances[index]
                    temp.beachID = "ID"
                    collections.push(beachCollection[index])
                    collections[i].distance = distances[index]
                    beachCollection.splice(index, 1)
                    distances.splice(index, 1)
                }
                res.send(collections)
            } else {
                res.send(500, err);
            }
        });

    },
    getForecast: function (req, res) {
        // Get weather data from wunderground 6093813dfdfae42b is the key
        var optionsget = {
            host: 'api.wunderground.com', // here only the domain name
            path: '/api/6093813dfdfae42b/forecast/q/' + req.params.lat + ',' + req.params.lon + '.json', // the rest of the url with parameters if needed
            method: 'GET' // do GET
        };
        var request = https.request(optionsget, function (response) {
            response.on('data', function (data) {
                if (JSON.parse(data.toString()).response.error) {
                    res.send({
                        message: JSON.parse(data.toString()).response.error.description
                    })
                } else {
                    res.send(data.toString())
                }
            });
        });
        request.end();
    },
    retrieveOne: function (req, res) {
        Beach.findOne({
            _id: req.params.id
        }, function (err, beach) {
            if (null === err) {
                res.send(beach)
            } else {
                res.send(500, err);
            }
        });
    },

    update: function (req, res) {
        // First find the existing document.
        properties = {}
        if (req.body.beachName != '') {
            properties.beachName = req.body.beachName
        }
        if (req.body.city != '') {
            properties.city = req.body.city
        }
        if (req.body.state != '') {
            properties.state = req.body.state
        }
        if (req.body.country != '') {
            properties.country = req.body.country
        }
        if (req.body.lat != null) {
            properties.lat = req.body.lat
        }
        if (req.body.lon != null) {
            properties.lon = req.body.lon
        }
        if (req.body.grooming != '') {
            properties.grooming = req.body.grooming
        }
        // then update it
        Beach.update({
            _id: req.params.id
        }, properties, function (err, numAffected, updatedBeach) {
            if (null === err) {
                console.log(numAffected)
                Beach.findOne({
                    _id: req.params.id
                }, function (err, newBeach) {
                    console.log(newBeach)
                    res.send(newBeach)
                })
            } else {
                console.log(err)
                res.send(500, err);
            }
        });
    },

// delete all beaches surveys and rates for a single beach
    destroy: function (req, res) {
        Beach.remove({
            _id: req.params.id
        }, function (err, numAffected) {
            if (null === err) {
                Survey.remove({
                    beachID: req.params.id
                }, function (err, numAffected) {
                    if (null === err) {
                        Rate.remove({
                            beachID: req.params.id
                        }, function (err, numAffected) {
                            if (null === err) {
                                res.send({
                                    message: "Success"
                                });
                            } else {
                                res.send(500, err);
                            }
                        });
                    } else {
                        res.send(500, err);
                    }
                });
            } else {
                res.send(500, err);
            }
        });
    },
    // get last 5 surveys
    recentSurveys: function (req, res) {
        Survey.find({
            beachID: req.params.id
        })
            .sort({
                'created': -1
            })
            .limit(5)
            .exec(function (err, surveys) {
                if (null === err) {
                    res.send(surveys);
                } else {
                    res.send(500, err);
                }
            });
    },
    // get last 5 rates
    recentRates: function (req, res) {

        var ratings = [0, 0, 0, 0, 0];
        var averageSum = 0;
        var averageTotal = 0;
        var total = [0, 0, 0, 0, 0];
        Rate.find({
            beachID: req.params.id
        })
            .sort({
                'created': -1
            })
            .exec(function (err, rates) {
                if (null === err) {
                    for (i in rates) {
                        averageTotal++;
                        averageSum += rates[i].rating
                        if (rates[i].created + 5 < new Date().getTime() / 1000 / 60 / 60 / 24) {
                            break;
                        }
                        for (j = 0; j < 5; j++) {
                            if (Math.floor(rates[i].created.getTime() / 1000 / 60 / 60 / 24) == Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) - j) {
                                ratings[j] += (rates[i].rating)
                                total[j]++;
                                break;
                            }
                        }
                    }
                    res.send({
                        ratings: ratings,
                        total: total,
                        average: Math.round(averageSum / averageTotal)
                    });
                } else {
                    res.send(500, err);
                }
            });
    }
};

module.exports = self;