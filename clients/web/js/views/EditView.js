define([
    'jquery',
    'jqueryui',
    'underscore',
    'backbone',
    'helpers',
    'datetimepicker',
    'moment',
], function ($, jQueryUI, _, Backbone, Helpers, datetimepicker, moment) {
    
    var EditView = Backbone.View.extend({

        tagName   : 'div',
        className : 'model',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.data     = options.data;
            this.model    = options.model;
            this.redirect = options.redirect;
            this.template = options.template;
            this.render();
        },
        
        // Define the events used when binding.
        events: {
            'click .back-button'   : 'back',
            'click .update-button' : 'update'
        },
        
        back: function (event) {
            event.preventDefault();
            console.log(this.model.id);
            if (this.model.isNew()) {
                var collection = this.model.collection;
                collection.remove(this.model);
            }
            window.history.back();
        },
        
        update: function (event) {
            event.preventDefault();
            var view = this;
            
            // Update the model
            var attributes = $('form').serializeObject();
            this.model.set(attributes);
            this.model.save(null, { 
                success: function (model, response, options) {
                    Backbone.history.navigate(view.redirect, { trigger: true });
                },
                error: function (model, response, options) {
                    console.log(response);
                },
            });
        },
        
        render: function () {
            var data = this.data || {};
            
            // Include the model attributes.
            if (this.model) {
                _.extend(data, this.model.toJSON());
            }
            
            // Include the helpers.
            data.datetimepicker = datetimepicker;
            data.moment = moment;
            
            // Create the HTML from the template and data.
            this.$el.html(_.template(this.template, data));
            return this;
        },
        
    });
    
    return EditView;
    
});
