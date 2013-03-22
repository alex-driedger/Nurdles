define([
  'jquery',
  'underscore',
  'backbone',
  '../../../models/Filter',
  'text!templates/partials/filters/EditFiltersView.html'
], function($, _, Backbone, Filter, editFiltersTemplate){
    var EditFiltersView = Backbone.View.extend({
        initialize: function(args) {
            if (!args)
                this.$el = $("#newFilter");

            this.model = new Filter();
        },

        template: _.template(editFiltersTemplate),

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
            /*
            $(e.target).closest("tr")
            .after("<tr> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <select class='wide-30'> <option value='sdf'>asd</option> </select> </td> <td> <input type='text' class='wide-90' /> </td> <td> <div class='plusMinusContainer'> <img src='../../img/plus.png' class='icon-small vertical-5 add-row' /> </div> </td> </tr>");
            $(e.target).closest("img").attr("src", "../../img/minus.png").removeClass("add-row").addClass("delete-row");
            */

            this.model.addOperator(new filterOperator());
        },

        render: function () {
            console.log("MODEL: ", this.model);
            this.$el.html(this.template(this.model));;
        }
    });

    return EditFiltersView;
});
