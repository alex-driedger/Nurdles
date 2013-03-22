define([
  'jquery',
  'underscore',
  'backbone',
  '../sidebar/SideBarToolsRow',
  '../filters/EditFiltersView',
  'text!templates/partials/sidebar/SidebarView.html'
], function($, _, Backbone, SideBarToolsRow, EditFiltersView, sidebarViewTemplate){
    var SidebarView = Backbone.View.extend({
        initialize: function(args) {
            this.subviews = [];
            this.$el = args || $("#sidebar");
        },

        render: function () {
            this.$el.html(sidebarViewTemplate);

            var sidebarTools = new SideBarToolsRow();
                editFilters = new EditFiltersView();
            sidebarTools.render();
            editFilters.render();

            this.subviews.push(sidebarTools);
            this.subviews.push(editFilters);
        }
    });

    return SidebarView;
});

