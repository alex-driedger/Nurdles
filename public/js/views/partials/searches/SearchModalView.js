define([
  'baseview',
  'openlayersutil',
  'text!templates/partials/searches/SearchModalView.html'
], function(Baseview, OpenLayersUtil, searchModalTemplate){
    var private = {
    };

    var SearchModalView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

        },

        template: _.template(searchModalTemplate),

        events: {
            "click #saveModalInformation": "saveModalInformation"
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

        saveModalInformation: function() {
            //Do save here
            this.close();
        },

        render: function () {
            var view = this;

            this.$el.html(this.template({
                property: this.property,
                type: this.type,
                prettyProperty: this.prettyProperty
            }));

            this.$el.parent().on("hide", function(e) { view.closeModal.apply(view, e); });

            return this;
        }
    });

    return SearchModalView;
});



