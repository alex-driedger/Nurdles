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
            "click .deleteFilter": "handleDeleteFilter",
            "click .saveFilter": "handleSaveFilter"
        },

        handleDeleteFilter: function(e) {
            var filterId = $(e.target).prop("id").split("-")[0],
                indexInExpandedFilter = _.indexOf(this.expandedFilters, filterId);

            if (indexInExpandedFilter != -1)
                this.expandedFilters.splice(indexInExpandedFilter, 1);
            
            this.filters = _.reject(this.filters, function(filter) {
                return filter._id == filterId;
            });
            
            this.activeFilters = _.reject(this.activeFilters, function(filter) {
                return filter._id == filterId;
            });

            //TODO: Delete from DB
            this.render(true);
        },
        
        handleSaveFilter: function(e) {
            var filterId = $(e.target).prop("id").split("-")[0];
            console.log($(e.target));
        },

        handleExpand: function(e) {
            var headerDiv = $(e.target).closest("div .collapsed"),
                divToToggle = headerDiv.next(),
                filterId = divToToggle.prop("id").split("-")[0],
                indexOfFilter = _.indexOf(this.expandedFilters, filterId);

            if (indexOfFilter == -1)
                this.expandedFilters.push(filterId);
            else
                this.expandedFilters.splice(indexOfFilter, 1);

            headerDiv.toggleClass("notExpanded");
            divToToggle.slideToggle(200);
        },

        handleFilterToggle: function(e) {
            e.stopImmediatePropagation();

            var target = $(e.target),
                id = target.prop("id");

            if (target.prop("checked")) {
                target.closest(".collapsed").addClass("selected");

                var filter = new Filter(),
                    operators = _.findWhere(this.filters, {_id: id}).operators;

                filter._id = id; //Local comparison will happen with the id field. No need to set it
                filter.set("operators", operators); //Mapview needs the operators on the model so we set it
                this.activeFilters.push(filter);
            }
            else {
                target.closest(".collapsed").removeClass("selected");

                this.activeFilters = _.reject(this.activeFilters, function(filter) {
                    return filter._id == id;
                });
            }

            Backbone.globalEvents.trigger("filtersChanged", this.activeFilters);
        },

        handleRowRemoval: function(e) {
            var operatorInfo = $(e.target).prop("id").split("-"),
                operatorNumber = operatorInfo[0],
                filter = _.findWhere(this.filters, {_id: operatorInfo[1]});
            
            filter.operators.splice(operatorNumber, 1);
            this.render(true);
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
            //this.updateValueTextFields($("#newType"), $("#newUpper"));
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

        render: function() {
            this.$el.html(this.template({
                filter: this.filter,
                features: this.features
            }));

            return this;

            /*
            view.$el.html(view.template(templateData));

            _.each(this.expandedFilters, function(filterId) {
                $("#" + filterId + "-container").prev().removeClass("notExpanded");
            });

            _.each(filters, function(filter) {
                var counter = 0;
                _.each(filter.operators, function(operator) {
                    view.updateAssociatedTypes($("#" + counter + "-" + filter._id + "-property"), $("#" + counter + "-" + filter._id + "-type"));
                    view.updateValueTextFields($("#" + counter + "-" + filter._id + "-type"), $("#" + counter + "-" + filter._id + "-upper"));
                    counter++;
                });
                    view.updateAssociatedTypes($("#" + filter._id + "-newProperty"), $("#" + filter._id + "-newType"));
                    view.updateValueTextFields($("#" + filter._id + "-newType"), $("#" + filter._id + "-newUpper"));
            });

            $('.filters-wrapper').find('.collapsed.notExpanded').next().hide();
            */
        }
    });

    return FilterDetailsView;
});

