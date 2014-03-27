define([
        'jquery',
        'underscore',
        'backbone',
        'models/BeachSurvey',
        'models/BeachReport',
        'models/BeachRate',
        'models/Beach',
        'views/InfoView',
        'authentication'
], function ( $, _, Backbone, BeachSurveyModel, BeachReportModel, BeachRateModel, BeachModel, InfoView, Authentication ) {

    var InfoRouter = Backbone.Router.extend({
        
        routes: {
            'info/:id' : 'index'
        },
        
        index: function (id) {
            Authentication.authorize(function () {
                var collections = []
                beachReports = new BeachReportModel.Collection([], {beachID: id});
                beachReports.fetch({
                    success: function (collection, response, options) {
                        collections.push(collection)
                        beachRates = new BeachRateModel.Collection([], {beachID: id});
                        beachRates.fetch({
                            success: function (collection, response, options) {
                                collections.push(collection)
                                beachSurveys = new BeachSurveyModel.Collection([], {beachID: id});
                                beachSurveys.fetch({
                                    success: function (collection, response, options) {
                                        collections.push(collection)
                                        beaches = new BeachModel.Collection([], {beachID: id});
                                        beaches.fetch({
                                            success: function (collection, response, options) {
                                                collections.push(collection)
                                                beaches = new BeachModel.Collection([], {lat: collections[3].models[0].attributes.lat, lon: collections[3].models[0].attributes.lon, request: "forecast"});
                                                beaches.fetch({
                                                    success: function (collection, response, options) {
                                                        collections.push(collection)
                                                        var infoView = new InfoView({collection: collections, id: id});
                                                        $('#content').html(infoView.el);
                                                        },
                                                    failure: function (collection, response, options) {
                                                        $('#content').html("An error has occured.");
                                                }
                                            });
                                            },
                                            failure: function (collection, response, options) {
                                                $('#content').html("An error has occured.");
                                            }
                                        });
                                    },
                                    failure: function (collection, response, options) {
                                        $('#content').html("An error has occured.");
                                    }
                                });
                            },
                            failure: function (collection, response, options) {
                                $('#content').html("An error has occured.");
                            }
                        });
                    },
                    failure: function (collection, response, options) {
                        $('#content').html("An error has occured.");
                    }
                });
            })
        },
                
    });
    
    return InfoRouter;
    
});                   