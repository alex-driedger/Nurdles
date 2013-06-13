define([
  'baseview',
  'openlayersutil',
  '../../../models/Filter',
  'text!templates/partials/filters/SubFilterContainer.html'
], function(Baseview, Utils, Filter, subFilterTemplate){
    var private = {
        operatorCounter: 0
    };

    var SubFilter = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);

            this.model = new Filter();

            //If anything happens to our operators collection, show the user.
            this.bindTo(this.model, "removeOperator", this.cacheOperators);
            this.bindTo(this.model, "clearOperators", this.reRender);
            this.bindTo(this.model, "addOperator", this.render);

            this.events["click .subFilter-" + this.subFilterLevel] = "showSubFilterUI";
        },

        template: _.template(subFilterTemplate),

        events: {
            "click .delete-row": "deleteRow",
            "click .add-row": "addRow",
            "click .clearFilter": "clearFilter",
            "click .createFilter": "createFilter",
            "click .applyFilter": "applyFilter",
            "change .newType": "handleTextFieldsChange",
            "change .newProperty": "handlePropertyChange"
        },

        applyFilter: function(e) {
            Backbone.globalEvents.trigger("filtersChanged", [this.model]);
            console.log(this.model);
        },

        hideView: function() {
            this.$el.parent().css("left", 0);
        },
        
        showView: function() {
            this.$el.parent().css("left", "100%");
        },

        showSubFilterUI: function(e) {
            e.stopPropagation();
            var img = $("#newSubFilter-" + this.subFilterLevel);
            if (img.prop("src").indexOf("left") != -1)
                img.prop("src", img.prop("src").replace("left", "right"));
            else
                img.prop("src", img.prop("src").replace("right", "left"));

            $(e.target).closest(".subFilter").toggleClass("sub-filter-marker-active")
                .toggleClass("subFilter");
            $(".canFade .subFilterLevel-" + this.subFilterLevel).toggleClass("faded");
            var subFilter = new SubFilter({
                features: this.features,
                types: this.types,
                $el: $("#newSubFilterContainer-" + this.subFilterLevel),
                subFilterLevel: this.subFilterLevel + 1,
                filters: this.filters,
                parentView: this
            });

            subFilter.render();
            this.addSubView(subFilter);

            if (this.subFilterLevel > 1)
                this.parentView.hideView();
        },

        cacheOperators: function() {
            _.each(this.model.getOperators(), function(operator) {
                operator.property = $("#" + operator.id + "-property-" + this.subFilterLevel).val();
                operator.type = $("#" + operator.id + "-type-" + this.subFilterLevel).val();
                if (operator.upperBoundary) {
                    operator.lowerBoundary = $("#" + operator.id + "-lower-" + this.subFilterLevel).val();
                    operator.upperBoundary = $("#" + operator.id + "-upper-" + this.subFilterLevel).val();
                }
                else
                    operator.value = $("#" + operator.id + "-lower-" + this.subFilterLevel).val();
            });

            this.model.set("name", $("#filterName-" + this.subFilterLevel).val());
        },

        clearFilter: function() {
            this.model.set("name", "");
            this.model.clearOperators();
        },

        createFilter: function(e) {
            var view = this;
            this.model.set("name", $("#filterName-" + this.subFilterLevel).val());
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
        },

        handlePropertyChange: function(e) {
            this.updateAssociatedTypes($(e.target));
        },

        updateAssociatedTypes: function(target) {
            var selectedVal = target.val(),
                type = _.findWhere(this.features, {name:selectedVal}).type,
                types = Utils.getTypeDropdownValues(type),
                selecteProperty = $("#newType-" + this.subFilterLevel).val(),
                view = this;
                 
            this.types = types;
            $("#newType-" + this.subFilterLevel).html("");

            _.each(types, function(type) {
                $('<option/>').val(type).text(type).appendTo($("#newType-" + view.subFilterLevel));
            });

            $("#newType-" + this.subFilterLevel).val(selecteProperty);
            this.updateValueTextFields($("#newType-" + this.subFilterLevel), $("#newUpper-" + this.subFilterLevel));
        },

        handleTextFieldsChange: function(e) {
            this.updateValueTextFields($(e.target), $("#newUpper-" + this.subFilterLevel));
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

        deleteRow: function(e) {
            this.model.removeOperator(e.target.id.toString());
        },

        addRow: function(e) {
            var newOperator = {
               id: private.operatorCounter++,
                property: $("#newProperty-" + this.subFilterLevel).val(),
                type: $("#newType-" + this.subFilterLevel).val(),
                lowerBoundary: $("#newLower-" + this.subFilterLevel).val(),
                upperBoundary: $("#newUpper-" + this.subFilterLevel).val()
            };

            if ($("#newUpper-" + this.subFilterLevel).val() == "") {
                newOperator.value = newOperator.lowerBoundary;
                delete newOperator.lowerBoundary;
                delete newOperator.upperBoundary;
            }

            this.model.set("name", $("#filterName-" + this.subFilterLevel).val());
            console.log(newOperator);

            this.cacheOperators();
            this.model.addOperator(newOperator);
            this.reRender();
        },

        render: function () {
            var templateData = {
                types: this.types,
                features: this.features,
                model: this.model,
                subFilterLevel: this.subFilterLevel,
                filters: this.filters
            };

            this.$el.removeClass("pull-right");
            this.$el.html(this.template(templateData)).addClass("wide-95");
            this.updateAssociatedTypes($("#newProperty-" + this.subFilterLevel));
            this.updateValueTextFields($("#newType-" + this.subFilterLevel), $("#newUpper"));
            
            return this;
        }
    });

    return SubFilter;
});

