define([
       'jquery',
       'underscore',
       'backbone',
       'jqueryui',
], function($, _, Backbone){
    var BaseView = Backbone.View.extend({

        initArgs: function(args) {
            var view = this;

            if (args) {
                _.each(_.keys(args), function(key) {
                    view[key] = args[key];
                });
            }
        },
        
        close: function(withFade) {
            this.trigger("close", this);
            this.closeSubviews();
            this.unbindFromAll();
            this.undelegateEvents();
            this.off();
            if (withFade) {
                this.$el.fadeOut(200, function() {
                    if ($(this).prop("id") == "main-content")
                        $(this).empty();
                    else
                        $(this).remove();
                });
            }
            else {
                if (this.$el.prop("id") == "main-content")
                    this.$el.empty();
                else
                    this.$el.remove();
            }
            
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
        
        unbindFromAll: function() {
            var self = this;
            
            _.each(this.bindings, function(binding, index, list) {
                binding.object.off(binding.event, binding.callback, self);
            });

            //Here, I can just reset the array and the garbarge collection will take care of the rest
            //Remember, I switched the event off so we should be ok
            this.bindings = [];
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
                this.preRender(args);
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
