define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/EditFiltersView.html'
], function(Baseview, Utils, Filter, editFiltersTemplate){
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
            "change #newType": "handleTextFieldsChange",
            "change #newProperty": "handlePropertyChange"
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

        handlePropertyChange: function(e) {
            this.updateAssociatedTypes($(e.target));
        },

        updateAssociatedTypes: function(target) {
            var selectedVal = target.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type;

            var types = Utils.getTypeDropdownValues(type);
            this.types = types;

            $("#newType").html("");
            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo($('#newType'));
            });

            this.updateValueTextFields($("#newType"), $("#newUpper"));
        },

        handleTextFieldsChange: function(e) {
            this.updateValueTextFields($(e.target), $("#newUpper"));
        },

        updateValueTextFields: function(target, fieldToToggle) {
            if (target.val() == "..")
                fieldToToggle.removeClass("hide");
            else
                fieldToToggle.addClass("hide");
        },

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
        },

        addRow: function(e) {
            var newOperator = {
                id: private.operatorCounter++,
                property: $("#newProperty").val(),
                type: $("#newType").val(),
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
            var templateData = {
                types: this.types,
                features: this.features,
                model: this.model.toJSON()
            };

            this.$el.html(this.template(templateData));
            this.updateAssociatedTypes($("#newProperty"));
            this.updateValueTextFields($("#newType"), $("#newUpper"));

            return this;
        }
    });

    return EditFiltersView;
});
