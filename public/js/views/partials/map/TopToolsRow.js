define([
  'baseview',
  'text!templates/partials/map/TopToolsRow.html'
], function(Baseview, topToolsTemplate){
    var TopToolsRow = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#controlsContainer");
        },

        events: {
            "click #showGrid": "toggleGraticule",
            "click #measure": "toggleMeasure" 
        },

        toggleGraticule: function(e) {
            var btn = $("#showGrid"),
                innerText = btn.html(),
                activate;

            if (btn.hasClass("active")) {
                activate = false;
                $(btn).html(innerText.replace("Hide", "Show"));
            }
            else {
                activate = true;
                $(btn).html(innerText.replace("Show", "Hide"));
            }

            btn.toggleClass("active");
            Backbone.globalEvents.trigger("toggleGraticule", activate);
        },

        toggleMeasure: function(e) {
            var btn = $("#measure"),
                activate;

            if (btn.hasClass("active")) {
                activate = false;
            }
            else {
                activate = true;
            }

            btn.toggleClass("active");
            Backbone.globalEvents.trigger("toggleMeasure", activate);
        },

        render: function () {
            this.$el.html(topToolsTemplate);
        }
    });

    return TopToolsRow;
});

