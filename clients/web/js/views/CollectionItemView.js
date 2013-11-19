define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
], function ($, _, Backbone, moment) {
  
  var CollectionItemView = Backbone.View.extend({

    tagName   : 'li',
    className : 'collection-item list-group-item',
    
    events: {
    },
    
    initialize: function (options) {
      this.model    = options.model;
      this.template = options.template;
      this.render();
    },
        
    render: function () {
      var data = this.model.toJSON();
      data.id = this.model.id;
      data.url = this.model.url();
      this.$el.html(_.template(this.template, data));
      return this;
    },
    
  });
  
  return CollectionItemView;
  
});
