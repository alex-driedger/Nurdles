define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/partials/EditFiltersView.html'
], function($, _, Backbone, editFiltersTemplate){
    var EditFiltersView = Backbone.View.extend({
        initialize: function(args) {
            if (!args)
                this.$el = $("#newFilter");
        },

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow"
        },

        deleteRow: function(e) {
            $(e.target).closest('tr')
            .children('td')
            .animate({ padding: 0 })
            .wrapInner('<div />')
            .children()
            .slideUp(function() { $(e.target.id).closest('tr').remove(); });
            return false;
        },

        addRow: function(e) {
            $(e.target).closest("tr")
            .after("<tr> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <input type='text' class='wide-90' /> </td> <td> <div class='plusMinusContainer'> <img src='../../img/plus.png' class='icon-small vertical-5 add-row' /> </div> </td> </tr>");
            $(e.target).closest("img").attr("src", "../../img/minus.png").removeClass("add-row").addClass("delete-row");
        },

        render: function () {
            this.$el.html(editFiltersTemplate);
        }
    });

    return EditFiltersView;
});
