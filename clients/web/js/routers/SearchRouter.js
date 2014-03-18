define([
        'jquery',
        'underscore',
        'backbone',
        'models/Beach',
        'views/SearchView',
        'authentication'
], function ( $, _, Backbone, BeachModel, SearchView, Authentication ) {

    var SearchRouter = Backbone.Router.extend({
        
        routes: {
            'search'  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
                var searchView = new SearchView();
                $('#content').html(searchView.el);
                initializeAutocomplete(BeachModel, "beachname", "beachName", 100, true)  
            })
        },
                
    });
    
    return SearchRouter;
    
});