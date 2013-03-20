define([
  'jquery',
  'underscore',
  'backbone',
  '../partials/SideBarToolsRow',
  'text!templates/partials/SidebarView.html'
], function($, _, Backbone, SideBarToolsRow, sidebarViewTemplate){
    var SidebarView = Backbone.View.extend({
        initialize: function(args) {
            this.subviews = [];
            this.$el = args || $("#sidebar");
        },

        render: function () {
            this.$el.html(sidebarViewTemplate);

            var sidebarTools = new SideBarToolsRow();
            sidebarTools.render();

            this.subviews.push(sidebarTools);
        }
    });

    return SidebarView;
});

