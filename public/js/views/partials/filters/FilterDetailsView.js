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

            this.events["click #" + this.model.get("_id") + "-filterLogicalOperatorCheckbox"] = "toggleTopLevelBinType";
            this.events["add #" + this.model.get("_id") + "-topLevelBin"] = "addOperatorToTopLevel";
            this.events["click #" + this.model.get("_id") + "-addLogicBin"] = "addBin";
        },

        template: _.template(filterDetailsTemplate),

        events: {
            "click .collapsed": "handleExpand",
            "click .activateCheckbox": "handleFilterToggle",
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click .deleteFilter": "deleteFilter",
            "click .saveFilter": "saveFilter"
        },

        stopPropagation: function(e) {
            e.stopPropagation();
        },

        preventDefault: function(e) {
            e.preventDefault();
            this.stopPropagation();
        },

        addOperatorToTopLevel: function(e, itemInfo) {
            this.stopPropagation(e);
            var oldBin =  _.findWhere(this.model.getBins(), {id: parseInt(itemInfo.sender.prop("id").split("-")[0])});
            var bin = this.model.get("topLevelBin");
            var operator = _.findWhere(oldBin.operators, {id: parseInt(itemInfo.itemId.split("-")[0])}),
                newOperatorList = _.reject(oldBin.operators, function(operator) {
                    return operator.id == parseInt(itemInfo.itemId.split("-")[0]);
                });
            
            console.log("SENDER: ", itemInfo.sender);
            oldBin.operators = newOperatorList;
            bin.operators.push(operator);

            this.reRender();
        },

        addOperatorToInnerBin: function(e, itemInfo) {
            this.stopPropagation(e);
            var oldBin = itemInfo.sender.prop("id") === (this.model.get("_id") + "-topLevelBin") ? this.model.get("topLevelBin") : _.findWhere(this.model.getBins(), {id: parseInt(itemInfo.sender.prop("id").split("-")[0])});
            var bin =  _.findWhere(this.model.getBins(), {id: parseInt($(e.target).prop("id").split("-")[0])});
            var operator = _.findWhere(oldBin.operators, {id: parseInt(itemInfo.itemId.split("-")[0])}),
                newOperatorList = _.reject(oldBin.operators, function(operator) {
                    return operator.id == parseInt(itemInfo.itemId.split("-")[0]);
                });
            
            oldBin.operators = newOperatorList;
            bin.operators.push(operator);

            this.reRender();
        },

        addBin: function() {
            this.model.addBin();
            this.reRender();
        },

        removeBin: function(e) {
            var binId = $(e.target).prop("id").split("-")[0];
            this.model.removeBin(binId);

            this.reRender();
        },

        toggleTopLevelBinType: function(e) {
            e.stopPropagation();
            this.model.get("topLevelBin").type = $(e.target).prop("checked") ? "&&" : "||";
        },

        toggleInnerBinType: function(e) {
            var binId = $(e.target).prop("id").split("-")[0],
                bin = _.findWhere(this.model.getBins(), {id: parseInt(binId)});

            bin.type = $(e.target).prop("checked") ? "&&" : "||";
        },

        cacheOperators: function() {
            var view = this;
            _.each(this.model.getBins(), function(bin) {
                    _.each(bin.operators, function(operator) {
                        if (!(operator.get && operator.get("isSubFilter"))) {
                            operator.property = $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-property").val();
                            operator.type = $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-type").val();
                            if (operator.upperBoundary) {
                                operator.lowerBoundary = $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-lower").val();
                                operator.upperBoundary = $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-upper").val();
                            }
                            else
                                operator.value = $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-lower").val();
                        }
                    });
            });

            _.each(this.model.get("topLevelBin").operators, function(operator) {
                if (!(operator.get && operator.get("isSubFilter"))) {
                    operator.property = $("#" + operator.id + "-" + view.model.get("_id") + "-property").val();
                    operator.type = $("#" + operator.id + "-" + view.model.get("_id") + "-type").val();
                    if (operator.upperBoundary) {
                        operator.lowerBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();
                        operator.upperBoundary = $("#" + operator.id + "-" + view.model.get("_id") + "-upper").val();
                    }
                    else
                        operator.value = $("#" + operator.id + "-" + view.model.get("_id") + "-lower").val();
                }
            });
        },

        hideView: function() {
            $("#sidebar").css("left", "-40%");
        },

        showView: function() {
            $("#sidebar").css("left", "0");
        },

        showSavedSubFilter: function(e) {
            var ids = $(e.target).prop("id").split("-"),
                bin, subFilter;

            if (ids.length > 3)
                bin = _.findWhere(this.model.getBins(), {id: parseInt(ids[1])});
            else
                bin = this.model.get("topLevelBin");

            subFilter = _.find(bin.operators, function(operator) {
                if (operator.get && operator.get("isSubFilter")) {
                    return operator.get("id") == ids[0];
                }
            });

            subFilter.isNew = false;

            this.showSubFilterUI(e, subFilter, $(e.target));
            delete this.events["click .viewSavedSubFilter-1"];
            this.delegateEvents();
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

            delete this.events["click .savedSubFilter-1"];
            this.delegateEvents();

            if ($("#sidebar").height() <= $("#content").height()) {
                //$('#sidebar').css('height',$('#sidebar').height() + container.height() + 75);
                //$("#main-content").animate({ scrollTop: $('#sidebar').height()}, 500);
                //this.lastFilter = false;
            }
        },

        deleteFilter: function(e) {
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

        saveFilter: function(e) {
            var filterId = $(e.target).prop("id").split("-")[0],
                operators = this.model.getOperators();

            this.cacheOperators();
            this.model.update();

            Backbone.globalEvents.trigger("updateFilter", this.model);
        },

        addRow: function(e) {
            var newOperator = {
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

        deleteRow: function(e) {
            var ids = $(e.target).prop("id").split("-"),
                operatorId = ids[0],
                binId = ids[1];

            e.stopPropagation();
            this.model.removeOperator(operatorId, binId, isNaN(binId));
            this.reRender();
        },

        updateAssociatedTypes: function(target) {
            var selectedVal = target.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selectedProperty = $(target.parent().next().children()[0]),
                selectedValue = selectedProperty.val(),
                textPrefix = selectedProperty.prop("id").substring(0, selectedProperty.prop("id").toLowerCase().indexOf("type")),
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == (this.subFilterLevel + "-new") ? "Upper" : "upper"));
                 
            this.types = types;
            selectedProperty.html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo(selectedProperty);
            });

            selectedProperty.val(selectedValue);
            this.updateValueTextFields(selectedProperty, textFieldToUpdate);
        },

        handleTextFieldsChange: function(e) {
            var textPrefix = $(e.target).prop("id").substring(0, $(e.target).prop("id").toLowerCase().indexOf("type")),
                textFieldToUpdate = $("#" + textPrefix + (textPrefix == (this.subFilterLevel + "-new") ? "Upper" : "upper"));

            this.updateValueTextFields($(e.target), textFieldToUpdate);
        },

        updateValueTextFields: function(target, fieldToToggle) {
            if (target.val() == "..") {
                fieldToToggle.parent().removeClass("hide");
                fieldToToggle.parent().prev().addClass("wide-45i");
            }
            else {
                fieldToToggle.parent().addClass("hide")
                    .prev().removeClass("wide-45i");
                fieldToToggle.val("");
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

            _.each(this.model.get("topLevelBin").operators, function(operator) {
                if (!(operator.get && operator.get("isSubFilter"))) {
                    view.updateAssociatedTypes($("#" + operator.id + "-" + view.model.get("_id") + "-property"), $("#" + operator.id + "-" + view.model.get("_id") + "-type"));
                    view.updateValueTextFields($("#" + operator.id + "-" + view.model.get("_id") + "-type"), $("#" + operator.id + "-" + view.model.get("_id") + "-upper"));
                }
            });

            _.each(this.model.getBins(), function(bin) {
                view.events["click #" + bin.id + "-" + view.subFilterLevel + "-logicalOperatorCheckbox"] = "toggleInnerBinType";
                view.events["add #" + bin.id + "-" + view.model.get("_id") + "-innerBin"] = "addOperatorToInnerBin";
                view.events["click #" + bin.id + "-" + view.model.get("_id") + "-removeBin"] = "removeBin";

                _.each(bin.operators, function(operator) {
                    if (!(operator.get && operator.get("isSubFilter"))) {
                        view.updateAssociatedTypes($("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-property"), $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-type"));
                        view.updateValueTextFields($("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-type"), $("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-upper"));
                    }
                });
            });

            this.updateAssociatedTypes($("#" + this.model.get("_id") + "-newProperty"), $("#" + this.model.get("_id") + "-newType"));
            this.updateValueTextFields($("#" + this.model.get("_id") + "-newType"), $("#" + this.model.get("_id") + "-newUpper"));

            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            $( "#" + this.model.get("_id") + "-topLevelBinContainer ul").sortable({
                placeholder: "ui-state-highlight",
                items: "li:not(.ui-state-disabled)",
                cancel: ".ui-state-disabled",
                connectWith: "#" + this.model.get("_id") + "-topLevelBinContainer ul",
                handle: "span",
                receive: function(event, ui) {
                    console.log($(this).prop("id") + " got a new operator");
                    $(event.target).trigger('add', {itemId: ui.item.prop("id"), sender: ui.sender});
                }
            }).disableSelection();

            this.events["click .savedSubFilter-1"] = "showSubFilterUI";
            this.events["click .viewSavedSubFilter-1"] = "showSavedSubFilter";

            this.delegateEvents();
            return this;
        }
    });

    return FilterDetailsView;
});

