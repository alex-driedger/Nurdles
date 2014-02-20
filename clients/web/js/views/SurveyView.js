define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/survey.html',
    'models/Survey',
    'jquerycookie'
], function ($, _, Backbone, survey, SurveyModel, jQueryCookie) {
    
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
            var weight = $("#weightval").val()+""+$("#weightbtn")[0].innerText;
            var area = ($("#areaval").val()+""+$("#areabtn")[0].innerText )
            surveyModel = new SurveyModel.Model();
            var d = new Date();
            var input = {
                beachID:$("#name").val(),
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
                created: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
            }
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
            this.collection = options.collection;
            this.render();
        },
        
        render: function () {
            var items =[
                { name: "Cigarette Butts", id:"1"},
                { name: "Food Wrappers (Candy, Chips, etc..)", id:"2"},
                { name: "Take Out/ Away Containers (Plastic)", id:"3"},
                { name: "Take Out/ Away Containers (Foamed Plastic)", id:"4"},
                { name: "Plastic Caps/ Lids", id:"5"},
                { name: "Cups and Plates (Plastic)", id:"6"},
                { name: "Cups and Plates (Foamed Plastic)", id:"7"},
                { name: "Cups and Plates (Paper)", id:"8"},
                { name: "Forks, Knives, Spoons", id:"9"}
            ];
            var items2 = [
            { name: "Motor Oil/ Lubricant Bottles", id:"10"},
            { name: "Other Plastic Bottles (Milk, Bleach, etc..)", id:"11"},
            { name: "Plastic Wrap/ Hard-Plastic Packaging", id:"12"},
            { name: "Strapping Bands (Plastic)", id:"13"},
            { name: "Strapping Bands (Rubber)", id:"14"},
            { name: "Tobacco Packaging/ Wrap", id:"15"}]
            this.$el.html( _.template( survey, {items:items, items2:items2} ) );
            return this;
        },
        
    });
    
    return SurveyView;
    
});
