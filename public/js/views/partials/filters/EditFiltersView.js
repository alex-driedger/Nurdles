define([
  'baseview',
  '../../../models/Filter',
  'text!templates/partials/filters/EditFiltersView.html'
], function(Baseview, Filter, editFiltersTemplate){
    var private = {
        operatorCounter: 0
    };

    var EditFiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.listenTo(this.model, "change", this.cacheOperators);
            this.listenTo(this.model, "addOperator", this.render);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click #clearFilter": "clearFilter",
            "click #createFilter": "createFilter",
            "change #newOperator": "updateValueTextFields"
        },

        cacheOperators: function() {
            _.each(this.model.getOperators(), function(operator) {
                operator.type = $("#" + operator.id + "-type").val();
                operator.operator = $("#" + operator.id + "-operator").val();
                operator.value = $("#" + operator.id + "-value").val();
            });

            this.render();
        },

        clearFilter: function() {
            this.model.clearOperators();
        },

        createFilter: function(e) {
            console.log(this.model);
            $.ajax({
                url: "/api/filters/save",
                type: "POST",
                data: this.model.attributes,
                success: function(response) {
                    console.log("Success!: ", response);
                },
                error: function(err) {
                    console.log(err);
                }
            });
            Backbone.globalEvents.trigger("filtersChanged", [this.model]);
        },

        updateValueTextFields: function(e) {
            console.log(e);
            if ($(e.target).val() == "=")
                $("#newValue2").addClass("hide");
            else
                $("#newValue2").removeClass("hide");
        },

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
        },

        addRow: function(e) {
            var newOperator = {
                id: private.operatorCounter++,
                property: $("#newType").val(),
                type: $("#newOperator").val(),
                lowerBoundary: $("#newValue1").val(),
                upperBoundary: $("#newValue2").val()
            };

            if ($("#newValue2").val() != "") {
                newOperator.upperBoundary = ($("#newValue2").val());
            }
            else {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
            }

            console.log(newOperator);

            this.model.addOperator(newOperator);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));;

            return this;
        }
    });

    return EditFiltersView;
});
