define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/multipleReport.html',
    'models/Report',
    'jquerycookie'
], function ($, _, Backbone, multipleReport, ReportModel,  jQueryCookie) {
    
    var MultipleReportView = Backbone.View.extend({

        tagName   : 'div',
        className : 'report',
        
        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click #showComments' : 'showComments',
            'click .pos' : 'tickerpos',
            'click .neg' : 'tickerneg',
            'click .btn-submit' : 'submit'
        },
        // The difference between multiple report and normal report is that multiple report sends an array of objects while report sends an array with a string
        submit: function()
        {
          reportModel = new ReportModel.Model();
            var items = []
            for (i = 1; i <= 15; i++)
            {
                val = $("#text"+i).val();
                name = $("#item_name"+i)[0].innerHTML
                if (val != 0)
                {
                    items.push({name:name,value:val});
                }
            }
            console.log(items)
          var d = new Date();
          var input = {
              items:items,
              description:$("#beachname").val(),
              comments: $("#comments").val(),
              created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
                }
          reportModel.save(input,{
                    success: function (res) {
                      //Backbone.history.navigate('', { trigger: true });
                        console.log(res.toJSON());
                    },
                    error: function (err) {
                        console.log("err")
                    }
                });
        },
        showComments: function() {
            visibility = document.getElementById("comments").style.visibility;
            showComments = document.getElementById("showComments");
            if (visibility== "hidden")
            {
            document.getElementById("comments").style.visibility = "visible"
            showComments.innerHTML = "- Cancel"
            } else 
            {
                document.getElementById("showComments").innerHTML="+ Add a Comment";
                document.getElementById("comments").style.visibility = "hidden"
            }
        },
        tickerpos: function(events) {
            $("#text"+events.currentTarget.id).val(Number($("#text"+events.currentTarget.id).val())+1);
        },
        tickerneg: function(events) {
            if ($("#text"+events.currentTarget.id).val() > 0)
            {
                $("#text"+events.currentTarget.id).val(Number($("#text"+events.currentTarget.id).val())-1);
            }
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.collection = options.collection;
            this.render();
        },
        render: function () {
            var items =[[
                { name: "Cigarette Butts", id:"1"},
                { name: "Food Wrappers (Candy, Chips, etc..)", id:"2"},
                { name: "Take Out/ Away Containers (Plastic)", id:"3"},
                { name: "Take Out/ Away Containers (Foamed Plastic)", id:"4"},
                { name: "Plastic Caps/ Lids", id:"5"},
                { name: "Cups and Plates (Plastic)", id:"6"},
                { name: "Cups and Plates (Foamed Plastic)", id:"7"},
                { name: "Cups and Plates (Paper)", id:"8"},
                { name: "Forks, Knives, Spoons", id:"9"}],
                [
                { name: "Motor Oil/ Lubricant Bottles", id:"10"},
                { name: "Other Plastic Bottles (Milk, Bleach, etc..)", id:"11"},
                { name: "Plastic Wrap/ Hard-Plastic Packaging", id:"12"},
                { name: "Strapping Bands (Plastic)", id:"13"},
                { name: "Strapping Bands (Rubber)", id:"14"},
                { name: "Tobacco Packaging/ Wrap", id:"15"}]];
            this.$el.html( _.template( multipleReport, {items:items[0], items2:items[1]} ) );
            return this;
        },        
        
    });
    
    return MultipleReportView;
    
});
