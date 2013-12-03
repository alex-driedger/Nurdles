define([
    'jquery',
    'underscore',
    'backbone',
    'views/CollectionView',
    'views/EditView',
    'authentication',
], function ($, _, Backbone, CollectionView, EditView, Authentication) {
    
    var CollectionRouter = Backbone.Router.extend({
        
        routes: {
        },
        
        initialize: function (options) {
            this.title = options.title || 'Collection';
            this.collection = options.collection;
            this.collectionTemplate = options.collectionTemplate;
            this.collectionItemTemplate = options.collectionItemTemplate;
            this.editTemplate = options.editTemplate;
        },
        
        index: function () {
            var router = this;
            console.log(router.routes);
            Authentication.authorize(function () {
                var collectionView = new CollectionView({ 
                    title        : router.title,
                    collection   : router.collection,
                    itemTemplate : router.collectionItemTemplate
                });
                $('#content').html(collectionView.el);
            });
        },
        
        create: function () {
            var router = this;
            Authentication.authorize(function () {
                var Model = router.collection.model;
                var model = new Model();
                router.collection.add(model);
                var editView = new EditView({
                    model    : model,
                    redirect : router.collection.url,
                    template : router.editTemplate
                });
                $('#content').html(editView.el);
            });
        },
        
        edit: function (id) {
            var router = this;
            Authentication.authorize(function () {
                var model = router.collection.get(id);
                var editView = new EditView({
                    model    : model,
                    redirect : router.collection.url,
                    template : router.editTemplate
                });
                $('#content').html(editView.el);
            });
        },
        
        delete: function (id) {
            var router = this;
            Authentication.authorize(function () {
                var model = router.collection.get(id);
                model.destroy();
                router.navigate(router.collection.url, { trigger: true });
            });
        },

    });
    
    return CollectionRouter;
    
});
