define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/multipleReport.html',
    'models/Report',
    'models/Beach',
    'jquerycookie'
], function ($, _, Backbone, multipleReport, ReportModel, BeachModel,  jQueryCookie) {
    
    var MultipleReportView = Backbone.View.extend({

        tagName   : 'div',
        className : 'report',
        
        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-surveyButtons' : 'expand',
            'click .pos' : 'tickerpos',
            'click .neg' : 'tickerneg',
            'click #cleaned' : 'cleaned',
            'click .btn-submit' : 'submit',
            'click #checkbox' : 'getNearestBeach'
        },
        getNearestBeach: function (events) {
            var checkboxVisual = document.getElementById("checkboxVisual")
            var checkbox = document.getElementById("checkbox")
            var beachName = document.getElementById('beachname')
            var submit = document.getElementById("submit")
            if (checkbox.checked)
            {
                checkboxVisual.style.backgroundColor = "gray";
                checkbox.disabled = true;
                submit.disabled = true;
                beachName.disabled = true;
                submit.innerText = "Please Wait"
                navigator.geolocation.getCurrentPosition(function (position)
                {
                beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        checkbox.disabled = false;
                        submit.disabled = false;
                         beachName.disabled = false;
                        submit.innerText = "Submit"
                        item = collection.models[0].attributes
                        $( "#beachname")[0].beachName = item.beachName
                        $( "#beachname")[0].beachID = item._id
                        $( "#beachname").val(item.beachName);

                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              })
            } else
            {
                checkboxVisual.style.backgroundColor = "rgba(0,0,0,0)";
            }
        },
    cleaned: function(events)
    {
            var checkboxVisual = document.getElementById("checkboxVisual2")
            var checkbox = document.getElementById("cleaned")
            if (checkbox.checked)
            {
                checkboxVisual.style.backgroundColor = "gray";
            } else
            {
                checkboxVisual.style.backgroundColor = "rgba(0,0,0,0)";
            }
    },
        // The difference between multiple report and normal report is that multiple report sends an array of objects while report sends an array with a string
        expand: function(events) {
            id = events.currentTarget.id
            console.log(id)
            console.log($("#block_"+id).is(":visible"))
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
        submit: function()
        {
            if ($("#beachname")[0].beachName != $("#beachname").val().toUpperCase())
            {
                alert("You must enter a location")
            } else
            {
            var items = []
            for (i = 1; i < 40; i++)
            {
                val = $("#text"+i).val();
                if (val != 0)
                {
                    items.push({name:$("#item_name"+i)[0].innerHTML,value:val});
                }
            }
          var d = new Date();
          var input = {
            items:items,
            beachID: $("#beachname")[0].beachID, 
            cleaned: document.getElementById("cleaned").checked,
            comments: $("#comments").val(),
            created: new Date()
            }
            reportModel = new ReportModel.Model();
            reportModel.save(input,{
                    success: function (res) {
                        alert("Your report has been submitted")
                      Backbone.history.navigate('#', { trigger: true });
                        console.log(res.toJSON());
                    },
                    error: function (err) {
                        console.log("err")
                    }
                });
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
            this.render();
        },
        render: function () {
            var items =[
                {header: "Most Likely To Find Items",
                id: "a",
                data:
                [
                    { name: "Cigarette Butts"},
                    { name: "Food Wrappers (Candy, Chips, etc..)"},
                    { name: "Take Out/ Away Containers (Plastic)"},
                    { name: "Take Out/ Away Containers (Foamed Plastic)"},
                    { name: "Plastic Caps/ Lids"},
                    { name: "Cups and Plates (Plastic)"},
                    { name: "Cups and Plates (Foamed Plastic)"},
                    { name: "Cups and Plates (Paper)"},
                    { name: "Forks, Knives, Spoons"}
                ]},
                {header: "Packaging Materials",
                id: "b",
                data:
                    [
                    { name: "Motor Oil/ Lubricant Bottles"},
                    { name: "Other Plastic Bottles (Milk, Bleach, etc..)"},
                    { name: "Plastic Wrap/ Hard-Plastic Packaging"},
                    { name: "Strapping Bands (Plastic)"},
                    { name: "Strapping Bands (Rubber)"},
                    { name: "Tobacco Packaging/ Wrap"}
                ]},
                {header: "Personal Hygiene",
                id: "c",
                data:
                [
                    { name: "Condoms"},
                    { name: "Diapers"},
                    { name: "Syringes"},
                    { name: "Tampons / Tampon Applicators"},
                    { name: "Toothbrush"},
                    { name: "Forks, Knives, Spoons"},
                    { name: "Beverage Bottles (Plastic)"},
                    { name: "Beverage Bottles (Glass)"},
                    { name: "Plastic Grocery Bags"},
                    { name: "Other Plastic Bags"},
                    { name: "Paper Bags"},
                    { name: "Beverage Cans"},
                    { name: "Straws/Stirrers"}
                ]},
                {header: "Fishing Gear",
                id: "d",
                data:
                [
                    { name: "Crab/Lobster/Fish Traps"},
                    { name: "Fishing Buoys/Floats"},
                    { name: "Fishing Line (1 yard/meter = 1 piece)"},
                    { name: "Fishing Net and Pieces < 1.5ft/50cm"},
                    { name: "Fishing Net and Pieces > 1.5ft/50cm"},
                    { name: "Rope (1 yard/meter = 1 piece"}

                ]},
                {header: "Other Trash",
                id: "e",
                data:
                [
                    { name: "Balloons"},
                    { name: "Cigarette Lighters"},
                    { name: "Construction Materials"}

                ]},
                {header: "Tiny Trash",
                id: "f",
                data:
                [
                    { name: "Plastic Pieces < 2.5cm"},
                    { name: "Plastic Pieces > 2.5cm"},
                    { name: "Foamed Plastic Pieces"}

                ]},
            ];
                var id = 0;
                for (i in items)
                {
                    for (j in items[i].data)
                    {
                        items[i].data[j].id = id
                        id++;
                    }
                }
            this.$el.html( _.template( multipleReport, {items:items} ) );
            return this;
        },        
        
    });
    
    return MultipleReportView;
    
});
