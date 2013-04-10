define([
  'baseview',
  '../sidebar/SideBarToolsRow',
  '../filters/EditFiltersView',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, SideBarToolsRow, EditFiltersView, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
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

