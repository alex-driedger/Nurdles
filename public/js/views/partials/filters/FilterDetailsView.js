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
            this.listenTo(this.model, "change", this.cacheOperators);
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

        cacheOperators: function() {
            var view = this;
            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.id + "-" + view.model.get("_id") + "-property").val();
                operator.type = $("#" + operator.id + "-" + view.model.get("_id") + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();
                    operator.upperBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();
            });

            this.tempOperator.property = $("#" + view.model.get("_id") + "-newProperty").val();
            this.tempOperator.type = $("#" + view.model.get("_id") + "-newType").val();
            if (this.tempOperator.upperBoundary) {
                this.tempOperator.lowerBoundary = $("#" + this.model.get("_id") + "-newLoower").val();
                this.tempOperator.upperBoundary = $("#" + this.model.get("_id") + "-newUpper").val();
            }
            else
                this.tempOperator.value = $("#" + this.model.get("_id") + "-newLower").val();

            this.tempChecked = $("#" + this.model.get("_id") + "-checkbox").prop("checked");
        },

        updateModel: function() {
            var operators = [],
                view = this;

            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.id + "-" + view.model.get("_id") + "-property").val();
                operator.type = $("#" + operator.id + "-" + view.model.get("_id") + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();
                    operator.upperBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();

                operators.push(operator);
            });

            this.model.setOperators(operators);
        },

        handleDeleteFilter: function(e) {
            var view = this;

            Backbone.globalEvents.trigger("deleteFilter", this.model);
            this.model.destroy({
                url:"/api/filters/" + this.model.get("_id"),
                success: function(response) {
                    console.log(response);
                    view.close();
                }
            });
        },
        
        handleSaveFilter: function(e) {
            this.updateModel();
            var filterId = $(e.target).prop("id").split("-")[0];
            this.model.update();

            Backbone.globalEvents.trigger("updateFilter", this.model);
        },

        handleAddRow: function(e) {
            var highestId = _.reduce(this.model.getOperators(), function(memo, operator) {
                if (operator.id > memo)
                    return parseInt(operator.id);
                else
                    return parseInt(memo);
            }, 0);

            var newOperator = {
                id: highestId + 1,
                property: $("#" + this.model.get("_id") + "-newProperty").val(),
                type: $("#" + this.model.get("_id") + "-newType").val(),
                lowerBoundary: $("#" + this.model.get("_id") + "-newLower").val(),
                upperBoundary: $("#" + this.model.get("_id") + "-newUpper").val()
            };

            if ($("#" + this.model.get("_id") + "-newUpper").val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.addOperator(newOperator);
            this.tempOperator = {};
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

            this.model.set("active", isActivated);
            Backbone.globalEvents.trigger("activateFilter", {
                filter: this.model,
                activate: isActivated
            });

            this.model.update();
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
                tempOperator: this.tempOperator,
                tempChecked: this.tempChecked,
                features: this.features,
                types: []
            }));

            this.delegateEvents(this.events);
            
            return this;
        },

        render: function() {
            var view = this;

            _.each(view.model.get("operators"), function(operator) {
                view.updateAssociatedTypes($("#" + operator.id + "-" + view.model.get("_id") + "-property"), $("#" + operator.id + "-" + view.model.get("_id") + "-type"));
                view.updateValueTextFields($("#" + operator.id + "-" + view.model.get("_id") + "-type"), $("#" + operator.id + "-" + view.model.get("_id") + "-upper"));
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

