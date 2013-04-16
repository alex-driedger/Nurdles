define([
  'baseview',
  '../filters/FiltersView',
  '../sidebar/SideBarToolsRow',
  'text!templates/partials/sidebar/SidebarView.html'
], function(Baseview, FiltersView, SideBarToolsRow, sidebarViewTemplate){
    var SidebarView = Baseview.extend({
        initialize: function(args) {
            this.$el = args || $("#sidebar");
        },

        render: function () {
            this.$el.html(sidebarViewTemplate);

            var sidebarTools = new SideBarToolsRow(),
                filtersView = new FiltersView();

            sidebarTools.render();
            filtersView.preRender().$el.appendTo("#toolContainer");
            filtersView.render();
            this.addSubView(sidebarTools);
            this.addSubView(filtersView);

            return this;
        }
    });

    return SidebarView;
});

