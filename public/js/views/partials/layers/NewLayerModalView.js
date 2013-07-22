define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/layers/NewLayerModalView.html'
], function(Baseview, OpenLayersUtil, newLayerModalTemplate){
    var private = {
    };

    var NewLayerModalView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

        },

        template: _.template(newLayerModalTemplate),

        events: {
            "click #saveModalInformation": "saveModalInformation",
            "change #newLayerEEName": "updateStyleSelect"
        },

        attachToPopup: function(modalDiv) {
            this.modalDiv = modalDiv;
            this.$el.appendTo(modalDiv);
        },

        closeModal: function(e) {
            var view = this;
            setTimeout(function() {view.close();}, 200);
        },

        show: function() {
            this.modalDiv.modal("show");
        },

        updateStyleSelect: function(e, eeLayerName) {
            var eeLayer;
            if (e) {
                eeLayerName = $(e.target).val();
            }

            this.$("#newLayerStyle").html("");

            eeLayer = _.findWhere(this.eeLayers, {Name: eeLayerName});
            
            if (eeLayer.Style instanceof Array) {
                _.each(eeLayer.Style, function(style) {
                    this.$("#newLayerStyle").append("<option value='" + style.Name + "'>" + style.Name + "</option>");
                });
            }

            else 
                this.$("#newLayerStyle").append("<option value='" + eeLayer.Style.Name + "'>" + eeLayer.Style.Name + "</option>");
        },

        saveModalInformation: function() {
            //Do save here
            this.close();
        },

        render: function () {
            var view = this;

            this.$el.html(this.template({
                layers: this.layers,
                eeLayers: this.eeLayers,
                property: this.property,
                type: this.type,
                prettyProperty: this.prettyProperty
            }));

            this.$el.parent().on("hide", function(e) { view.closeModal.apply(view, e); });

            this.delegateEvents();
            return this;
        }
    });

    return NewLayerModalView;
});





