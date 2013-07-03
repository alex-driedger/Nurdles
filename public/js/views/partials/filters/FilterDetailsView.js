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
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click .deleteFilter": "deleteFilter",
            "click .saveFilter": "saveFilter"
        },

        preventDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        cacheOperators: function() {
            var view = this;
            _.each(this.model.getBins(), function(bin) {
                if (!(operator.get && operator.get("isSubFilter"))) {
                    _.each(bin.operators, function(operator) {
                        operator.property = $("#" + operator.id + "-" + bin.id + view.model.get("_id") + "-property").val();
                        operator.type = $("#" + operator.id + "-" + bin.id + view.model.get("_id") + "-type").val();
                        if (operator.upperBoundary) {
                            operator.lowerBoundary = $("#" + operator.id + "-" + bin.id + view.model.get("_id") + "-lower").val();
                            operator.upperBoundary = $("#" + operator.id + "-" + bin.id + view.model.get("_id") + "-upper").val();
                        }
                        else
                            operator.value = $("#" + operator.id + "-" + bin.id + view.model.get("_id") + "-lower").val();
                    });
                }
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

            _.each(this.model.get("topLevelBin").operators, function(operator) {
                if (!(operator.get && operator.get("isSubFilter"))) {
                    view.updateAssociatedTypes($("#" + operator.id + "-" + view.model.get("_id") + "-property"), $("#" + operator.id + "-" + view.model.get("_id") + "-type"));
                    view.updateValueTextFields($("#" + operator.id + "-" + view.model.get("_id") + "-type"), $("#" + operator.id + "-" + view.model.get("_id") + "-upper"));
                }
            });

            _.each(this.model.getBins(), function(bin) {
                _.each(bin.operators, function(operator) {
                    if (!(operator.get && operator.get("isSubFilter"))) {
                        view.updateAssociatedTypes($("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-property"), $("#" + operator.id + "-" + view.model.get("_id") + "-type"));
                        view.updateValueTextFields($("#" + operator.id + "-" + bin.id + "-" + view.model.get("_id") + "-type"), $("#" + operator.id + "-" + view.model.get("_id") + "-upper"));
                    }
                });
            });

            this.updateAssociatedTypes($("#" + this.model.get("_id") + "-newProperty"), $("#" + this.model.get("_id") + "-newType"));
            this.updateValueTextFields($("#" + this.model.get("_id") + "-newType"), $("#" + this.model.get("_id") + "-newUpper"));

            if (!this.isExpanded)
                $("#" + this.model.get("_id") + "-container").hide();

            this.events["click .savedSubFilter-1"] = "showSubFilterUI";
            this.events["click .viewSavedSubFilter-1"] = "showSavedSubFilter";

            this.delegateEvents();
            return this;
        }
    });

    return FilterDetailsView;
});

