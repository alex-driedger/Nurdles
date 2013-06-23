define([
  'baseview',
  'openlayersutil',
  './SubFilterView',
  '../../../models/Filter',
  'text!templates/partials/filters/FilterDetailsView.html'
], function(Baseview, Utils, SubFilter, Filter, filterDetailsTemplate){

    var private = {};

    var FilterDetailsView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.isExpanded = this.isActive = false;
            this.listenTo(this.model, "change", this.cacheOperators);

            var transformedOperators = [],
                operators = this.model.getOperators();

            this.model.operatorCounter = operators.length;
            this.events["click #" + this.model.get("_id") + "-logicalOperator"] = "preventDefault";
            this.delegateEvents();
        },

        template: _.template(filterDetailsTemplate),

        events: {
            "click .collapsed": "handleExpand",
            "click .activateCheckbox": "handleFilterToggle",
            "click .delete-row": "handleRowRemoval",
            "click .add-row": "handleAddRow",
            "click .deleteFilter": "handleDeleteFilter",
            "click .saveFilter": "handleSaveFilter",
            "click .savedSubFilter-1": "showSubFilterUI",
            "click .viewSavedSubFilter-1": "showSavedSubFilter",
            "click .logicalOperatorContainer": "handleLogicalOperatorSwitch"
        },

        preventDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        handleLogicalOperatorSwitch: function(e) {
            e.stopPropagation();
            e.preventDefault();

            var checkbox = $(e.target).parent().prev(),
                order = checkbox.prop("id").split("-")[0],
                operators = this.model.getOperators(),
                operator = _.findWhere(operators, {order: parseInt(order)});

            checkbox.prop("checked", !checkbox.prop("checked"));
            if (checkbox.prop("checked"))
                operator.logicalOperator =  "&&";
            else
                operator.logicalOperator =  "||";

            if (operator.get && operator.get("isSubFilter"))
                operator.set("logicalOperator", operator.logicalOperator);

            this.model.setOperators(operators);
            this.model.update();
        },

        cacheOperators: function() {
            var view = this;
            _.each(this.model.getOperators(), function(operator) {
                operator.logicalOperator = $("#" + operator.order + "-" + view.model.get("_id") + "-logicalOperatorCheckbox").prop("checked") ? "&&" : "||";
                operator.property = $("#" + operator.order + "-" + view.model.get("_id") + "-property").val();
                operator.type = $("#" + operator.order + "-" + view.model.get("_id") + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.order + "-" + view.model.get("_id") + "-lower").val();
                    operator.upperBoundary = $("#" + operator.order + "-" + view.model.get("_id") + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.order + "-" + view.model.get("_id") + "-lower").val();
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

        hideView: function() {
            $("#sidebar").css("left", "-40%");
        },

        showView: function() {
            $("#sidebar").css("left", "0");
        },

        showSavedSubFilter: function(e) {
            var order = $(e.target).prop("id").split("-")[0],
                filter = _.findWhere(this.model.get("operators"), {order: parseInt(order)}),
                operators = filter.operators;

            filter.isNew = false;
            this.showSubFilterUI(e, filter, $("#" + order + "-savedSubFilterContainer-1"));
        },

        showSubFilterUI: function(e, model, container) {
            e.stopPropagation();
            if (!container) 
                container = $("#" + this.model.get("_id") + "-newSavedSubFilterContainer-1");

            $(e.target).closest(".subFilter").toggleClass("sub-filter-marker-active")
                .toggleClass("subFilter");
            $(".canFade").toggleClass("faded");
            var subFilter = new SubFilter({
                features: this.features,
                types: this.types,
                $el: container,
                subFilterLevel: 1,
                filters: this.filters,
                parentView: this,
                model: model
            });

            subFilter.render();
            this.addSubView(subFilter);

            if ($("#sidebar").height() <= $("#content").height()) {
                //$('#sidebar').css('height',$('#sidebar').height() + container.height() + 75);
                //$("#main-content").animate({ scrollTop: $('#sidebar').height()}, 500);
                this.lastFilter = false;
            }
        },

        updateModel: function() {
            var operators = [],
                view = this;

            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.order + "-" + view.model.get("_id") + "-property").val();
                operator.type = $("#" + operator.order + "-" + view.model.get("_id") + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.order + "-" + view.model.get("_id") + "-lower").val();
                    operator.upperBoundary = $("#" + operator.order + "-" + view.model.get("_id") + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.order + "-" + view.model.get("_id") + "-lower").val();

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

        appendSubFilter: function(subFilter) {
            subFilter.set("isSubFilter", true);
            this.model.addOperator(subFilter, true);
            this.reRender();

            this.delegateEvents();
        },

        handleSaveFilter: function(e) {
            this.updateModel();
            var filterId = $(e.target).prop("id").split("-")[0];
            this.model.update();

            Backbone.globalEvents.trigger("updateFilter", this.model);
        },

        handleAddRow: function(e) {
            var highestId = _.reduce(this.model.getOperators(), function(memo, operator) {
                if (operator.order > memo)
                    return parseInt(operator.order);
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
                types: [],
                lastFilter: this.lastFilter
            }));

            this.delegateEvents(this.events);

            
            return this;
        },

        render: function() {
            var view = this;

            _.each(view.model.get("operators"), function(operator) {
                if (!(operator.get && operator.get("isSubFilter"))) {
                    view.updateAssociatedTypes($("#" + operator.order + "-" + view.model.get("_id") + "-property"), $("#" + operator.order + "-" + view.model.get("_id") + "-type"));
                    view.updateValueTextFields($("#" + operator.order + "-" + view.model.get("_id") + "-type"), $("#" + operator.order + "-" + view.model.get("_id") + "-upper"));
                }
            });

            this.updateAssociatedTypes($("#" + this.model.get("_id") + "-newProperty"), $("#" + this.model.get("_id") + "-newType"));
            this.updateValueTextFields($("#" + this.model.get("_id") + "-newType"), $("#" + this.model.get("_id") + "-newUpper"));

            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            return this;
        },

        onClose: function() {
            $("#sidebar").css("height", "100%");
        }
    });

    return FilterDetailsView;
});

