define([
  'baseview',
  './EditFiltersView',
  './SavedFiltersView',
  '../../../models/Filter',
  '../../../collections/FilterCollection',
  'text!templates/partials/filters/EditFiltersView.html',
  'text!templates/partials/filters/FiltersView.html'
], function(Baseview, SavedFiltersView, EditFiltersView, Filter, FilterCollection, editFiltersTemplate, showFiltersTemplate){
    var private = {
    };

    var FiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.filters = new Backbone.Collection.extend({
                model: Filter 
            });
        },

        template: _.template(showFiltersTemplate),

        events: {},

        preRender: function() {
            this.$el.html(this.template());
            return this;
        },

        render: function () {
            var editFilters = new EditFiltersView({$el: $("#editFilter")}),
                savedFilters = new SavedFiltersView({$el: $("#savedFilters")});

            this.addSubView(editFilters);
            this.addSubView(savedFilters);
            editFilters.render();
            savedFilters.render();

            return this;
        }
    });

    return FiltersView;
});

