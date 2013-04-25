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
            Backbone.globalEvents.trigger("deleteFilter", this.filter);
            this.close();
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
                filter: this.filter,
                activate: isActivated
            });
        },

        handleRowRemoval: function(e) {
            var operatorInfo = $(e.target).prop("id").split("-"),
                operatorNumber = parseInt(operatorInfo[0]);
            
            if (this.filter.get("operators").length === 1)
                this.filter.set("operators", []); //Need to do this since there's weird behaviour with splicing single object arrays
            else
                this.filter.set("operators", this.filter.get("operators").splice(operatorNumber, 1));

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
                filter: this.filter,
                features: this.features,
                types: []
            }));

            this.delegateEvents(this.events);
            
            return this;
        },

        render: function() {
            var counter = 0,
                view = this;

            _.each(view.filter.get("operators"), function(operator) {
                view.updateAssociatedTypes($("#" + counter + "-" + view.filter.get("_id") + "-property"), $("#" + counter + "-" + view.filter.get("_id") + "-type"));
                view.updateValueTextFields($("#" + counter + "-" + view.filter.get("_id") + "-type"), $("#" + counter + "-" + view.filter.get("_id") + "-upper"));
                counter++;
            });

            this.updateAssociatedTypes($("#" + this.filter.get("_id") + "-newProperty"), $("#" + this.filter.get("_id") + "-newType"));
            this.updateValueTextFields($("#" + this.filter.get("_id") + "-newType"), $("#" + this.filter.get("_id") + "-newUpper"));

            if (!this.isExpanded)
                $("#" + this.filter.get("_id") + "-container").hide();

            return this;
        }
    });

    return FilterDetailsView;
});

