define([
  'baseview',
  'text!templates/partials/map/MeasurePopup.html'
], function(Baseview, measurePopupTemplate){
    var private = {
        handleMeasurements: function(event) {
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            if (measure > 0 ) {
                $("#measureContainer").append("<div>Segment " + this.numberOfSegments + ": " +  measure.toFixed(3) + " " + event.units + "</div>");
                this.numberOfSegments++;
            }
            else 
                $("#measureContainer").html("");
        }
    };

    var MeasurePopupView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
            this.numberOfSegments = 1;

            this.bindToControl(this.measureControl, "measure", private.handleMeasurements, this);
            this.bindToControl(this.measureControl, "measurepartial", private.handleMeasurements, this);
            this.bindTo(Backbone.globalEvents, "measureEnd", this.close);
        },

        template: _.template(measurePopupTemplate),

        render: function() {
            var view = this;

            this.$el.html(this.template(this.model));
            $("#dialog").append(this.$el);

            this.measureControl.element = $("#measureContainer");

            $("#dialog").dialog({
                title: "Measurements",
                minHeight: 70,
                close: function(evt, ui) {
                    view.close();
                },
                position: {
                    my: "right top",
                    at: "right bottom",
                    of: $(".btn-toolbar")
                }
            });

            return this;
        },

        onClose: function() {
            $("#dialog").dialog("close");
        }
    });

    return MeasurePopupView;
});


