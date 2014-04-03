define([
    'jquery',
    'underscore',
    'backbone',
    'models/BeachSurvey',
    'models/BeachRate',
    'models/Beach',
    'views/InfoView',
    'authentication'
], function ($, _, Backbone, BeachSurveyModel, BeachRateModel, BeachModel, InfoView, Authentication) {

    var InfoRouter = Backbone.Router.extend({

        routes: {
            'info/:id': 'index'
        },

        index: function (id) {
            Authentication.authorize(function () {
                 $('#content').html("<p style='display: block; font-size: 15%; text-align: center; line-height: 100vh; margin: 0;'>LOADING</p>");   
                var collections = []
                beachRates = new BeachRateModel.Collection([], {
                    beachID: id
                });
                beachRates.fetch({
                    success: function (collection, response, options) {
                        collections.push(collection)
                        beachSurveys = new BeachSurveyModel.Collection([], {
                            beachID: id
                        });
                        beachSurveys.fetch({
                            success: function (collection, response, options) {
                                collections.push(collection)
                                beaches = new BeachModel.Collection([], {
                                    beachID: id
                                });
                                beaches.fetch({
                                    success: function (collection, response, options) {
                                        collections.push(collection)
                                        beaches = new BeachModel.Collection([], {
                                            lat: collections[2].models[0].attributes.lat,
                                            lon: collections[2].models[0].attributes.lon,
                                            request: "forecast"
                                        });
                                        beaches.fetch({
                                            success: function (collection, response, options) {
                                                collections.push(collection)
                                                var infoView = new InfoView({
                                                    collection: collections,
                                                    id: id
                                                });
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
            })
        },
    });
    return InfoRouter;
});