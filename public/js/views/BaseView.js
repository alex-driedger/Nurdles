define([
   'jquery',
   'underscore',
   'backbone',
   'text!templates/partials/loading.html',
   'jqueryui',
   'bootstrap'
], function($, _, Backbone, loadingTemplate){
    var BaseView = Backbone.View.extend({

        initArgs: function(args) {
            var view = this;
            this.loaderTemplate = _.template(loadingTemplate);
            this.startLoad();

            if (args) {
                for (var attribute in args) {
                    view[attribute] = args[attribute];
                }
            }

            if (this.restoreState)
                this.restoreState();

            //Events are "inherited" through the prototype chain so we need to re-delegate 
            //them in order for this particular view to only respond to it's own events.
            this.delegateEvents()
        },

        startLoad: function() {
            this.$el.css("height", "100%");
            this.$el.html(this.loaderTemplate());
        },

        fadeInViewElements: function(template) {
            this.$el.css("display", "none");
            if (template)
                this.$el.html(template);

            this.$el.fadeIn();
        },
        
        close: function() {
            this.trigger("close", this);
            this.closeSubviews();
            this.unbindFromAll();
            this.unbindFromAllControls();
            this.undelegateEvents();
            this.off();
            if (this.$el.prop("id") == "main-content")
                this.$el.empty();
            else
                this.$el.remove();

            if (this.saveState)
                this.saveState();
            
            if (this.onClose) 
                this.onClose();
        },
        
        //We'll use the view events delegator for "in-house" events.
        //But we'll bindTo global events so we can undelegate them upon closing the view
        bindTo: function(object, e, callback, context) {
            context || (context = this);
            
            object.on(e, callback, context);
            
            this.bindings || (this.bindings = []);
            this.bindings.push({ object: object, event: e, callback: callback });
        },

        bindToControl: function(control, e, callback, context) {
            context || (context = this);
            
            control.events.register(e, context, callback);
            
            this.controlBindings || (this.controlBindings = []);
            this.controlBindings.push({ control: control, event: e, callback: callback, view: this });
        },

        eachSubview: function(iterator) {
            _.each(this.subviews, iterator);
        },

        unbindEventsToView: function(view) {
            var self = this;
            var bindingsToRemove = _.where(this.bindings, {object: view});
            _.each(bindingsToRemove, function(binding, index, list) {
                binding.object.off(binding.event, binding.callback, self);
            });

            this.bindings = _.difference(this.bindings, bindingsToRemove);
        },

        unbindControlEventsFromView: function(view) {
            var self = this;
            var bindingsToRemove = _.where(this.controlBindings, {view: view});
            _.each(bindingsToRemove, function(binding, index, list) {
                binding.control.events.unregister(binding.event, self, binding.callback);
            });

            this.controlBindings = _.difference(this.controlBindings, bindingsToRemove);
        },
        
        unbindFromAll: function() {
            var self = this;
            
            _.each(this.bindings, function(binding, index, list) {
                binding.object.off(binding.event, binding.callback, self);
            });

            //Here, I can just reset the array and the garbarge collection will take care of the rest
            //Remember, I switched the event off so we should be ok
            this.bindings = [];
        },

        unbindFromAllControls: function() {
            var self = this;
            
            _.each(this.controlBindings, function(binding, index, list) {
                binding.control.events.unregister(binding.event, self, binding.callback);
            });

            //Here, I can just reset the array and the garbarge collection will take care of the rest
            //Remember, I switched the event off so we should be ok
            this.controlBindings = [];
        },
        
        addSubView: function(view) {
            this.subviews || (this.subviews = {});
            this.subviews[view.cid] = view;

            //We're binding to the child's close action
            //That way we can unbind any (other) events we're listening for on the child
            //as well as remove it from our subviews
            //Normally I don't like coupling like this but, here, it makes a lot of sense
            this.bindTo(view, "close", this.removeSubView, this);
        },

        removeSubView: function(view) {
            this.unbindEventsToView(view);
            //I want to free up the memory so I'm deleting
            delete this.subviews[view.cid];
        },

        reRender: function(args) {
            if (this.preRender)
                this.preRender.apply(this, args);
            this.render(args);
        },
        
        closeSubviews: function() {
            this.eachSubview(function(subview) {
                subview.close();
            });
            
            this.subviews = {};
        }
    });

    return BaseView;
});
