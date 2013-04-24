define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/FilterDetailsView.html'
], function(Baseview, Utils, Filter, editFiltersTemplate){

    var private = {};

    var FilterDetailsView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(filterDetailsTemplate),

        events: {
        }

    });

    return FilterDetailsView;
});

