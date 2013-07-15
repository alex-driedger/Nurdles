define([
  'baseview',
  'openlayersutil',
  './NewFilterModalView',
  'text!templates/partials/layers/SavedLayerView.html'
], function(Baseview, OpenLayersUtil, NewFilterModalView, savedLayerTemplate){

    var SavedLayerTemplate = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(savedLayerTemplate),

        events: {
            "click .feature": "addNewFilter",
            "click .collapsed-header": "expandDetails"
        },

        expandDetails: function(e) {
            console.log("TEST", e);
        },

        addNewFilter: function(e) {
            e.preventDefault();
            var modal = new NewFilterModalView({
                property: $(e.target).prop("id").split("-")[0],
                type: $(e.target).prop("id").split("-")[1],
                prettyProperty: $(e.target).html()
            });
            modal.attachToPopup($("#modalPopup"));
            modal.render();

            modal.show();
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model,
                numberTypes: this.numberTypes,
                stringTypes: this.stringTypes,
                spatialTypes: this.spatialTypes
            }));
            
            this.delegateEvents();

            return this;
        }
    });

    return SavedLayerTemplate;
});



