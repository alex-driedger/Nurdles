define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/survey.html',
    'models/Survey',
    'models/Beach',
    'jquerycookie'
], function ($, _, Backbone, survey, SurveyModel, BeachModel, jQueryCookie) {
    
    var SurveyView = Backbone.View.extend({

        tagName   : 'div',
        className : 'survey',

        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .btn-surveyButtons' : 'expand',
            'click .pos' : 'tickerpos',
            'click .neg' : 'tickerneg',
            'click .weight' : 'updateWeight',
            'click .area' : 'updateArea',
            'click .btn-submit' : 'submit'
        },
        updateWeight: function(events) {
            var temp = events.target.innerText
            events.target.innerText = $("#weightbtn")[0].innerText
            $("#weightbtn")[0].innerText = temp;
        },
        updateArea: function(events) {
            var temp = events.target.innerText
            events.target.innerText = $("#areabtn")[0].innerText
            $("#areabtn")[0].innerText = temp;
        },
        submit: function(events) {
            var checkBox = document.getElementById("ucl").checked
            if (($("#beachname")[0].beachName != $("#beachname").val().toUpperCase()) && !checkBox)
            {
                alert("Please select a beach from the dropdown list")
            } else
            {
            var items = []
            for (i = 1; i <= 15; i++)
            {
                val = $("#text"+i).val();
                if (val != 0)
                {
                    items.push({name:$("#item_name"+i)[0].innerHTML,value:val});
                }
            }
            var weight = $("#weightval").val()+""+$("#weightbtn")[0].innerText;
            var area = ($("#areaval").val()+""+$("#areabtn")[0].innerText )
            surveyModel = new SurveyModel.Model();
            var input = {
                beachID:$("#beachname")[0].beachID,
                environment: $("#environment").val(),
                beachtype:$("#beachtype").val(),
                info1:$("#info1").val(), 
                info2:$("#info2").val(),
                date:$("#date").val(), 
                weight:weight,
                area:area,
                volunteers:parseInt($("#volunteersval").val()),
                bags:parseInt($("#bagsval").val()),
                notes:$("#notes").val(),
                items: items,
                localConcern:$("#localConcern").val(),
                peculiarItems:$("#peculiarItems").val(),
                injuredAnimals:$("#injuredAnimals").val(),
                hazardousDebris:$("#hazardousDebris").val(),
                created: new Date()
            }
            if (checkBox)
            {
            navigator.geolocation.getCurrentPosition(function (position)
            {
            beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
            beaches.fetch( {
                success: function( collection, response, options) {
                    input.beachID = collection.models[0].attributes._id
                    console.log(input.beachID)   
                    surveyModel.save(input,{
                    success: function (res) {
                      //Backbone.history.navigate('', { trigger: true });
                        console.log(res.toJSON());
                    },
                    error: function (err) {
                        console.log("err")
                    }
                });
                },
                failure: function( collection, response, options) {
                    $('#content').html("An error has occured.");                    
                }
            });
          })
            } else
            {
            surveyModel.save(input,{
                    success: function (res) {
                      //Backbone.history.navigate('', { trigger: true });
                        console.log(res.toJSON());
                    },
                    error: function (err) {
                        console.log("err")
                    }
                });
            }
        }

        },
        expand: function(events) {
            id = events.currentTarget.id
            if ($("#block_"+id).is(":visible"))
            {
                $("#block_"+id).slideUp(750)
                if (id.length == 1)
                {
                    $("#"+id).animate({color: "black"},750)
                } else
                {
                    $("#"+id).animate({color: "gray"},750)
                }

            } else
            {
                $('body').animate({
                    scrollTop: $("#"+id).offset().top
                },750)
                    $("#"+id).animate({color: "#3AF"}, 750)
                    $("#block_"+id).slideDown(750 )
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

        replaceField: function(events) {
            $("#text"+events.target.parentElement.className).val(events.currentTarget.innerText);
        },
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        render: function () {
            var items =[
                {header: "Most Likely To Find Items",
                id: "items_a",
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
                id: "items_b",
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
                id: "items_c",
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
                id: "items_d",
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
                id: "items_e",
                data:
                [
                    { name: "Balloons"},
                    { name: "Cigarette Lighters"},
                    { name: "Construction Materials"}

                ]},
                {header: "Tiny Trash",
                id: "items_f",
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
            this.$el.html( _.template( survey, {items:items} ) );
            return this;
        },
        
    });
    
    return SurveyView;
    
});
