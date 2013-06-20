define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  './SubFilterView',
  'text!templates/partials/filters/EditFiltersView.html',
], function(Baseview, Utils, Filter, SubFilter, editFiltersTemplate){
    var EditFiltersView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            if (!this.model)
                this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.bindTo(this.model, "removeOperator", this.cacheOperators);
            this.bindTo(this.model, "clearOperators", this.reRender);
            this.bindTo(this.model, "addOperator", this.render);
        },

        template: _.template(editFiltersTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click #clearFilter": "clearFilter",
            "click #createFilter": "createFilter",
            "click #applyFilter": "applyFilter",
            "click .subFilter-1": "showSubFilterUI",
            "click .viewSubFilter-1": "showSubFilterUIWithSeed",
            "change #newType": "handleTextFieldsChange",
            "change #newProperty": "handlePropertyChange",
            "click .logicalOperator": "preventDefault"
        },

        preventDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        applyFilter: function(e) {
            Backbone.globalEvents.trigger("filtersChanged", [this.model]);
            console.log(this.model);
        },

        hideView: function() {
            $("#sidebar").css("left", "-40%");
        },

        showView: function() {
            $("#sidebar").css("left", "0");
        },

        showSubFilterUIWithSeed: function(e) {
            var order = $(e.target).prop("id").split("-")[0],
                filter = _.findWhere(this.model.get("operators"), {order: parseInt(order)});

            this.showSubFilterUI(e, filter, $("#" + order + "-subFilterContainer-1"));
        },

        showSubFilterUI: function(e, model, container) {
            e.stopPropagation();
            if (!container) 
                container = $("#newSubFilterContainer");

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
        },

        cacheOperators: function() {
            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.order + "-property").val();
                operator.type = $("#" + operator.order + "-type").val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.order + "-lower").val();
                    operator.upperBoundary = $("#" + operator.order + "-upper").val();
                }
                else
                    operator.value = $("#" + operator.order + "-lower").val();
            });

            this.model.set("name", $("#filterName").val());
        },

        clearFilter: function() {
            this.model.set("name", "");
            this.model.clearOperators();
        },

        appendSubFilter: function(subFilter) {
            subFilter.set("isSubFilter", true);
            this.model.addOperator(subFilter, true);

            this.delegateEvents();
        },

        createFilter: function(e) {
            var view = this;
            this.model.set("name", $("#filterName").val());
            this.model.save(null, {
                success: function(response){
                    Backbone.globalEvents.trigger("addedFilter", response);
                    view.model = new Filter();
                    view.reRender();
                },
                error: function(err){
                    console.log(err); 
                },
                url: "/api/filters/save"
            });
            console.log(this.model);
        },

        handlePropertyChange: function(e) {
            this.updateAssociatedTypes($(e.target));
        },

        updateAssociatedTypes: function(target) {
            var selectedVal = target.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selecteProperty = $("#newType").val();
                 
            this.types = types;
            $("#newType").html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo($('#newType'));
            });

            $("#newType").val(selecteProperty);
            this.updateValueTextFields($("#newType"), $("#newUpper"));
        },

        handleTextFieldsChange: function(e) {
            this.updateValueTextFields($(e.target), $("#newUpper"));
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

        deleteSubFilter: function(subFilterView) {
            this.removeSubView(subFilterView.cid);
            this.reRender();
        },

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
            this.reRender();
        },

        addRow: function(e) {
            var newOperator = {
                property: $("#newProperty").val(),
                type: $("#newType").val(),
                lowerBoundary: $("#newLower").val(),
                upperBoundary: $("#newUpper").val()
            };

            if ($("#newUpper").val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.set("name", $("#filterName").val());
            console.log(newOperator);

            this.cacheOperators();
            this.model.addOperator(newOperator);
            this.reRender();
        },

        render: function () {
            var templateData = {
                types: this.types,
                features: this.features,
                model: this.model
            };

            this.$el.html(this.template(templateData));
            this.updateAssociatedTypes($("#newProperty"));
            this.updateValueTextFields($("#newType"), $("#newUpper"));

            return this;
        }
    });

    return EditFiltersView;
});
