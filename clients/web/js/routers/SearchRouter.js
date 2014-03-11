define([
        'jquery',
        'underscore',
        'backbone',
        'models/Beach',
        'views/SearchView',
], function ( $, _, Backbone, BeachModel, SearchView ) {

    var SearchRouter = Backbone.Router.extend({
        
        routes: {
            'search'  : 'index'
        },
        
        index: function () {
            var searchView = new SearchView();
            $('#content').html(searchView.el);
            initializeAutocomplete(BeachModel, "beachname", "beachName", 100)  
        },
                
    });
    
    return SearchRouter;
    
});