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
            this.initArgs(args);
        },

        template: _.template(showFiltersTemplate),

        events: {},

        preRender: function() {
            this.$el.html(this.template());
            return this;
        },

        render: function () {
            var editFilters = new EditFiltersView({$el: $("#editFilter")});
            this.addSubView(editFilters);
            editFilters.render();

            return this;
        }
    });

    return FiltersView;
});

