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
        },

        attachToPopup: function(modalDiv) {
            this.modalDiv = modalDiv;
            this.$el.appendTo(modalDiv);
        },

        show: function() {
            this.modalDiv.modal("show");
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });

    return SearchModalView;
});



