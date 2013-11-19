define([
    'jquery',
    'underscore',
    'backbone',
    'views/CollectionItemView'
], function ($, _, Backbone, CollectionItemView) {
    
    var CollectionView = Backbone.View.extend({
        
        tagName     : 'div',
        className : '',
        
        // Define the events used when binding.
        events: {
        },
        
        initialize: function (options) {
            this.title          = options.title;
            this.collection     = options.collection;
            this.template       = options.template;
            
            // Creating items.
            this.items          = [];
            this.itemsContainer = options.itemsContainer || '.items';
            this.itemTemplate   = options.itemTemplate;
            this.itemView       = options.itemView || CollectionItemView;
            
            this.render();
        },
        
        createItemViews: function () {
            var view = this;
            
            // Get the container for the items.
            // Note: the items container must be specified when the view provides a template.
            var $container = view.$el.find();
            if (view.itemsContainer) {
                $container = view.$el.find(view.itemsContainer);
            }
    
            // Remove the old items.
            _.each(view.items, function (item, index, items) {
                item.remove();
            });
            
            // Fetch the collection from the API.
            this.collection.each(function (model, index, collection) {
                var item = new view.itemView({ 
                    model: model, 
                    template: view.itemTemplate 
                });
        
                // Append the item.
                $container.append(item.el);
        
                // Track the item for removal during the next reload.
                view.items.push(item);
            });
            
        },
        
        render: function () {
                
            // Load the template.
            // Note: the items container must be specified when the view uses a template.
            if (this.template) {
                this.$el.html(_.template(this.template));
            } else {
                var $title = $('<h2></h2>');
                $title.text(this.title);
                this.$el.append($title);
                var $container = $('<ul class="list-group items"></ul>');
                this.$el.append($container);
            }
            
            // Reload the collection.
            this.createItemViews();
            
            // Add the create button.
            var url = this.collection.url + '/create';
            this.$el.append('<div class="list-actions"><a href="#' + url + '">Create</a></div>');
            
            return this;
        },
        
    });
    
    return CollectionView;
    
});