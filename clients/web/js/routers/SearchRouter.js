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
            'search'  : 'index',
        },
        
        index: function (event) {
            Authentication.authorize(function () {
                var searchView = new SearchView();
                $('#content').html(searchView.el);
                initializeAutocomplete(BeachModel, "beachname", "beachName", Infinity, "info")  
            })
        },
                
    });
    
    return SearchRouter;
    
});