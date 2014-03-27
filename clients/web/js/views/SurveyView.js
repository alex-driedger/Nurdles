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
            'click #submit' : 'submit',
            'click #checkbox' : 'getNearestBeach'
        },
        getNearestBeach: function (events) {
            var items = [document.getElementById('country'),document.getElementById('city'),document.getElementById('state'),document.getElementById('beachname')]
            var checkbox = document.getElementById("checkbox")
            var submit = document.getElementById("submit")
            if (checkbox.checked)
            {
                for (i in items)
                {
                    items[i].readOnly = true;
                    items[i].value = ""
                }
                checkbox.disabled = true;
                submit.disabled = true;
                submit.innerText = "Please Wait"
                navigator.geolocation.getCurrentPosition(function (position)
                {
                beaches = new BeachModel.Collection([], {lat: position.coords.latitude,lon: position.coords.longitude, amount: 1});
                beaches.fetch( {
                    success: function( collection, response, options) {
                        checkbox.disabled = false;
                        submit.disabled = false;
                for (i in items)
                {
                    items[i].readOnly = false;
                    items[i].value = ""
                }
                        submit.innerText = "Submit"
                        item = collection.models[0].attributes
                        console.log(item)
                        $( "#beachname")[0].beachName = item.beachName
                        $( "#beachname")[0].beachID = item._id
                        $( "#beachname").val(item.beachName);
                        $( "#city").val(item.city);
                        $( "#state").val(item.state);
                        $("#country").val(item.country);
                    },
                    failure: function( collection, response, options) {
                        $('#content').html("An error has occured.");                    
                    }
                });
              })
            } else
            {
                for ( i in items)
                {
                    items[i].readOnly = false;
                    items[i].value = ""
                }
            }
        },
        updateWeight: function(events) {
            var temp = events.target.innerHTML
            events.target.innerHTML = $("#weightbtn")[0].innerHTML
            $("#weightbtn")[0].innerHTML = temp;
        },
        updateArea: function(events) {
            var temp = events.target.innerHTML
            console.log(events.target.innerHTML)
            console.log($("#weightbtn")[0].innerHTML)
            events.target.innerHTML = $("#areabtn")[0].innerHTML
            $("#areabtn")[0].innerHTML = temp;
        },
        submit: function(events) {
            {
            if ($("#beachname")[0].beachName != $("#beachname").val().toUpperCase())
            {
                alert("Please select a beach from the dropdown list")
            } else if ($('input[name=a]:checked')[0] == undefined || $('input[name=b]:checked')[0] == undefined)
            {
                alert("Please fill in beach description data")
            } else if ($("#weightval").val() == "" || $("#areaval").val() == "" || $("#volunteersval").val() == "" ) 
            {
                alert("Please provide a cleanup summary")
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
                env = ($('#L_' + $('input[name=a]:checked')[0].id)[0].innerText);
                type = ($('#L_' + $('input[name=b]:checked')[0].id)[0].innerText);
            var weight = $("#weightval").val()+$("#weightbtn")[0].innerText;
            var area = ($("#areaval").val()+$("#areabtn")[0].innerText )
            surveyModel = new SurveyModel.Model();
            var input = {
                beachID:$("#beachname")[0].beachID,
                environment: env,
                beachType: type,
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

            surveyModel.save(input,{
                    success: function (res) {
                        //Backbone.history.navigate('', { trigger: true });
                        alert("Your survey has been submitted")
                        console.log(res.toJSON());
                        Backbone.history.navigate('#', { trigger: true });
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
                console.log(id)
            this.$el.html( _.template( survey, {items:items} ) );
            return this;
        },
        
    });
    
    return SurveyView;
    
});
