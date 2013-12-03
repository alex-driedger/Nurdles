define([
    'routers/CollectionRouter',
    'text!templates/usersItemTemplate.html',
    'text!templates/usersEditTemplate.html'
], function (CollectionRouter, usersItemTemplate, usersEditTemplate) {
    
    var UsersRouter = CollectionRouter.extend({
        
        routes: {
            ''                 : 'index',
            'users'            : 'index',
            'users/create'     : 'create',
            'users/:id/edit'   : 'edit',
            'users/:id/delete' : 'delete',
        },
        
        initialize: function (options) {
            this.title = 'Users';
            this.collection = window.app.users;
            this.collectionItemTemplate = usersItemTemplate;
            this.editTemplate = usersEditTemplate;
        },
                
    });
    
    return UsersRouter;
    
});
