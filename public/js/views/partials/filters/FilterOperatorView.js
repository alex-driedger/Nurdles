define([
  'jquery',
  'underscore',
  'backbone',
  '../../../models/FilterOperator',
  'text!templates/partials/filters/FilterOperator.html'
], function($, _, Backbone, FilterOperator, editFiltersTemplate){
    var FilterOperatorView = Backbone.View.extend({
        initialize: function(args) {
            this.model = new FilterOperator();
        },

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow"
        },

        deleteRow: function(e) {
            $(this).closest('tr')
            .children('td')
            .animate({ padding: 0 })
            .wrapInner('<div />')
            .children()
            .slideUp(function() { $(this).closest('tr').remove(); });
            return false;
        },

        addRow: function(e) {
            $(this).closest("tr")
            .after("<tr> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <input type='text' class='wide-90' /> </td> <td> <div class='plusMinusContainer'> <img src='../../img/plus.png' class='icon-small vertical-5 add-row' /> </div> </td> </tr>");
            $(this).closest("img").attr("src", "../../img/minus.png").removeClass("add-row").addClass("delete-row");
        },

        render: function () {
            this.$el.html(editFiltersTemplate);
        }
    });

    return FilterOperatorView;
});

