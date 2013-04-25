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
                return filter.get("_id") == filterId;
            });
            
            this.activeFilters = _.reject(this.activeFilters, function(filter) {
                return filter.get("_id") == filterId;
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
                filterId = divToToggle.prop("id").split("-")[0];

            Backbone.globalEvents.trigger("toggleExpandedFilter", this.filter);
            /*
            if (indexOfFilter == -1)
                this.expandedFilters.push(filterId);
            else
                this.expandedFilters.splice(indexOfFilter, 1);
                */

            headerDiv.toggleClass("notExpanded");
            divToToggle.slideToggle(200);
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
                filter: this.filter,
                activate: isActivated
            });

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

        preRender: function() {
            this.$el.html(this.template({
                filter: this.filter,
                features: this.features
            }));

            this.delegateEvents(this.events);
            
            return this;
        },

        render: function() {
            var counter = 0,
                view = this;


            _.each(view.filter.operators, function(operator) {
                //view.updateAssociatedTypes($("#" + counter + "-" + view.filter._id + "-property"), $("#" + counter + "-" + view.filter._id + "-type"));
                //view.updateValueTextFields($("#" + counter + "-" + view.filter._id + "-type"), $("#" + counter + "-" + view.filter._id + "-upper"));
                counter++;
            });
                //this.updateAssociatedTypes($("#" + this.filter._id + "-newProperty"), $("#" + this.filter._id + "-newType"));
                //this.updateValueTextFields($("#" + this.filter._id + "-newType"), $("#" + this.filter._id + "-newUpper"));

            $("#" + this.filter.get("_id") + "-container").hide();
            return this;
        }
    });

    return FilterDetailsView;
});

