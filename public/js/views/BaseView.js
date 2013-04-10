define([
       'jquery',
       'underscore',
       'backbone',
], function($, _, Backbone){
    var BaseView = Backbone.View.extend({
        
        close: function() {
            this.closeSubviews();
            this.unbindFromAll();
            this.undelegateEvents();
            this.off();
            this.remove();
            this.trigger("close", this);
            
            if (this.onClose) this.onClose();
        },
        
        //We'll use the view events delegator for "in-house" events.
        //But we'll bindTo global events so we can undelegate them upon closing the view
        bindTo: function(object, e, callback, context) {
            context || (context = this);
            
            object.on(e, callback, context);
            
            this.bindings || (this.bindings = []);
            this.bindings.push({ object: object, event: e, callback: callback });
        },
        
        unbindFromAll: function() {
            var self = this;
            
            _.each(this.bindings, function(binding) {
                binding.object.off(binding.event, binding.callback, self);
            });
        },
        
        appendSubview: function(view) {
            this.subviews || (this.subviews = {});
            this.subviews[view.cid] = view;

            this.bindTo(view, "close", this.removeSubView, this);
        },

        removeSubView: function(view) {
            var parent = this;
            this.eachSubview(function(subView) {
                if (subView.id == view.id) {
                    subview.close();
                    parent.subviews[subview.id] = null;
                }
            });
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
