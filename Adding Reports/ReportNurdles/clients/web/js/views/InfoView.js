define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/infoTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, infoTemplate, jQueryCookie) {
    
    var InfoView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-surveyButtons' : 'expand'
        },
        // redirect is used on successful create or update.
        expand: function(events) {
            id = events.currentTarget.id
                if ($("#block_"+id).is(":visible"))
            {
                $("#block_"+id).slideUp(750)
                $("#"+id).animate({color: "black"},750)

            } else
            {
                $("#block_"+id).slideDown(750)
                $("#"+id).animate({color: "#3AF"}, 750)
            }

        },
        initialize: function (options) {
            this.total = options.total
            this.id = options.id
            this.collection = options.collection
            this.render();
        },
        getRates: function() {
            var returnStatement = [];
            var days = ["Today: ", "Yesterday: ", "2 Days Ago: " , "3 Days Ago: ", "4 Days Ago: "]
            var ratings = this.collection[1].attributes.ratings
            var totals = this.collection[1].attributes.total
            for (i in totals)
            {
                if (totals[i] > 0)
                {
                    var cleanliness = ["Clean", "Moderately Clean", "Dirty"]
                    returnStatement.push({day: days[i], rating: cleanliness[Math.round(ratings[i]/totals[i])] + " based on " + totals[i] + " rating(s)"})
                } else
                {
                    returnStatement.push({day: days[i], rating: "No data"})
                }
            }
            return returnStatement

        },
        getReports: function () {
            returnStatement = [];
            for (i in this.collection[0].attributes)
            {
                var date = new Date(this.collection[0].attributes[i].created)
                returnStatement.push({html: ("Report Date : " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes()), id: this.collection[0].attributes[i]._id})
            }
            return returnStatement
        },
        getSurveys: function() {
            returnStatement = [];
            var attributes = this.collection[2].attributes
            for (i in attributes)
            {
                var date = new Date(this.collection[2].attributes[i].created)
                returnStatement.push({html: ("Survey Date : " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes()), id: this.collection[2].attributes[i]._id})
            }
            return returnStatement
        },
        render: function () {
            console.log(this.collection[4].models[0].attributes.forecast)
            if (this.collection[4].models[0].attributes.message != undefined)
            {
                alert(this.collection[4].models[0].attributes.message)
                high = "N/A"
                low = "N/A"
                conditions = "N/A"
            } else
            {
                var high = this.collection[4].models[0].attributes.forecast.simpleforecast.forecastday[0].high.celsius
                if (high == "")
                {
                    high = (this.collection[4].models[0].attributes.forecast.simpleforecast.forecastday[0].high.fahrenheit  -  32)*(5/9)
                }
                var low = this.collection[4].models[0].attributes.forecast.simpleforecast.forecastday[0].low.celsius
                if (low == "")
                {
                    low = (this.collection[4].models[0].attributes.forecast.simpleforecast.forecastday[0].low.fahrenheit  -  32)*(5/9)
                }
                var conditions = this.collection[4].models[0].attributes.forecast.simpleforecast.forecastday[0].conditions
            }
                var attributes = this.collection[3].models[0].attributes
                switch(attributes.lastRating)
                {
                    case 0:
                        attributes.lastRating = "Clean"
                        break
                    case 1:
                        attributes.lastRating = "Moderately Clean"
                        break
                    case 2:
                        attributes.lastRating = "Dirty"
                        break
                    default:
                        attributes.lastRating = "Unknown"
                }
                this.$el.html(_.template(infoTemplate, {conditions: conditions, high: high, low: low, beachInfo: attributes, reportsHTML: this.getReports(), ratesHTML: this.getRates(), surveysHTML: this.getSurveys()}));
                return this;

        },
        
    });
    
    return InfoView;
    
});
