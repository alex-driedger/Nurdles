define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/FilterDetailsView.html'
], function(Baseview, Utils, Filter, filterDetailsTemplate){

    var private = {};

    var FilterDetailsView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.isExpanded = this.isActive = false;
        },

        template: _.template(filterDetailsTemplate),

        events: {
            "click .collapsed": "handleExpand",
            "click .checkbox": "handleFilterToggle",
            "click .delete-row": "handleRowRemoval",
            "click .add-row": "handleAddRow",
            "click .deleteFilter": "handleDeleteFilter",
            "click .saveFilter": "handleSaveFilter"
        },

        handleDeleteFilter: function(e) {
            Backbone.globalEvents.trigger("deleteFilter", this.model);
            this.close();
        },
        
        handleSaveFilter: function(e) {
            var filterId = $(e.target).prop("id").split("-")[0];
            console.log($(e.target));
        },

        handleAddRow: function(e) {
            var newOperator = {
                id: this.model.get("operators").length,
                property: $("#" + this.model.get("_id") + "-newProperty").val(),
                type: $("#" + this.model.get("_id") + "-newType").val(),
                lowerBoundary: $("#n" + this.model.get("_id") + "-ewLower").val(),
                upperBoundary: $("#" + this.model.get("_id") + "-newUpper").val()
            };

            if ($("#" + this.model.get("_id") + "-newUpper").val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.addOperator(newOperator);
            this.reRender();
        },

        handleExpand: function(e) {
            var headerDiv = $(e.target).closest("div .collapsed"),
                divToToggle = headerDiv.next(),
                filterId = divToToggle.prop("id").split("-")[0];

            Backbone.globalEvents.trigger("toggleExpandedFilter", this.model);

            headerDiv.toggleClass("notExpanded");
            divToToggle.slideToggle(200);

            this.isExpanded = !this.isExpanded;
        },

        handleFilterToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id"),
                isActivated = false;

            if (target.prop("checked")) {
                target.closest(".collapsed").addClass("selected");
                isActivated = true;

            }
            else {
                target.closest(".collapsed").removeClass("selected");
            }

            Backbone.globalEvents.trigger("activateFilter", {
                filter: this.model,
                activate: isActivated
            });
        },

        handleRowRemoval: function(e) {
            var operatorInfo = $(e.target).prop("id").split("-"),
                operatorNumber = parseInt(operatorInfo[0]);

            this.model.removeOperator(operatorNumber);
            this.reRender();
        },

        updateAssociatedTypes: function(property, typeDropDown) {
            var selectedVal = property.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selectedProperty = typeDropDown.val();
                 
            this.types = types;
            typeDropDown.html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo(typeDropDown);
            });

            typeDropDown.val(selectedProperty);
        },

        updateValueTextFields: function(target, fieldToToggle) {
            $("#editFilter .staged").toggleClass("wide-95");
            if (target.val() == "..") {
                target.closest("td").next().prop("colspan", "1")
                fieldToToggle.removeClass("hide");
                fieldToToggle.parent().removeClass("hide");
            }
            else {
                fieldToToggle.addClass("hide");
                fieldToToggle.parent().addClass("hide");
                fieldToToggle.html("");
                target.closest("td").next().prop("colspan", "2")
            }
        },

        preRender: function() {
            this.$el.html(this.template({
                filter: this.model,
                features: this.features,
                types: []
            }));

            this.delegateEvents(this.events);
            
            return this;
        },

        render: function() {
            var counter = 0,
                view = this;

            _.each(view.model.get("operators"), function(operator) {
                view.updateAssociatedTypes($("#" + counter + "-" + view.model.get("_id") + "-property"), $("#" + counter + "-" + view.model.get("_id") + "-type"));
                view.updateValueTextFields($("#" + counter + "-" + view.model.get("_id") + "-type"), $("#" + counter + "-" + view.model.get("_id") + "-upper"));
                counter++;
            });

            this.updateAssociatedTypes($("#" + this.model.get("_id") + "-newProperty"), $("#" + this.model.get("_id") + "-newType"));
            this.updateValueTextFields($("#" + this.model.get("_id") + "-newType"), $("#" + this.model.get("_id") + "-newUpper"));

            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            return this;
        }
    });

    return FilterDetailsView;
});

