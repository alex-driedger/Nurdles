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
        // Get Rates is alot more complicated than the rest because we need to get an average rating, and we need to figure out how many days ago each thing was
        // rather than just pulling in the date
        getReports: function () {
            returnStatement = [];
            for (i in this.collection[0].attributes)
            {
                var date = new Date(this.collection[0].attributes[i].created)
                returnStatement.push({html: ("Report Date : " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes()), id: this.collection[0].attributes[i]._id})
            }
            return returnStatement
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
                    returnStatement.push({day: days[i], rating: Math.floor(ratings[i]/totals[i]*50) + "/100 based on " + totals[i] + " ratings"})
                } else
                {
                    returnStatement.push({day: days[i], rating: "No data"})
                }
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
            var attributes = this.collection[3].models[0].attributes
            this.$el.html(_.template(infoTemplate, {beachInfo: attributes, reportsHTML: this.getReports(), ratesHTML: this.getRates(), surveysHTML: this.getSurveys()}));
            return this;
        },
        
    });
    
    return InfoView;
    
});
