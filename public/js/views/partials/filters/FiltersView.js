define([
  'baseview',
  './EditFiltersView',
  '../../../models/Filter',
  '../../../collections/FilterCollection',
  'text!templates/partials/filters/EditFiltersView.html',
  'text!templates/partials/filters/FiltersView.html'
], function(Baseview, EditFiltersView, Filter, FilterCollection, editFiltersTemplate, showFiltersTemplate){
    var private = {
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#filter");
        },

        template: _.template(showFiltersTemplate),

        events: {},

        render: function () {
            this.$el.html(this.template);

            var editFilters = new EditFiltersView({$el: $("#editFilter")});
            this.addSubView(editFilters);
            editFilters.render();
        }
    });

    return FiltersView;
});

