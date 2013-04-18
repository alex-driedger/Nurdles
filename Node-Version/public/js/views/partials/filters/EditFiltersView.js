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
                operator.property = $("#" + operator.id + "-property").val();
                operator.type = $("#" + operator.id + "-type").val();
                operator.lowerBoundary = $("#" + operator.id + "-lower").val();
                operator.upperBoundary = $("#" + operator.id + "-upper").val();
            });

            this.model.set("name", $("#filterName").val());

            this.render();
        },

        clearFilter: function() {
            this.model.clearOperators();
        },

        createFilter: function(e) {
            this.model.set("name", $("#filterName").val());
            this.model.save( function(response){
                Backbone.globalEvents.trigger("addedFilter", response);
            }, function(err){console.log(err);});
        },

        updateValueTextFields: function(e) {
            console.log(e);
            if ($(e.target).val() == "=")
                $("#newUpper").addClass("hide");
            else
                $("#newUpper").removeClass("hide");
        },

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
        },

        addRow: function(e) {
            var newOperator = {
                id: private.operatorCounter++,
                property: $("#newType").val(),
                type: $("#newOperator").val(),
                lowerBoundary: $("#newLower").val(),
                upperBoundary: $("#newUpper").val()
            };

            if (!$("#newUpper").val() != "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.set("name", $("#filterName").val());
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
