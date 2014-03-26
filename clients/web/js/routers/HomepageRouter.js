define([
        'jquery',
        'underscore',
        'backbone',
        'views/HomepageView',
        'authentication'
], function ( $, _, Backbone, HomepageView, Authentication) {

    var HomepageRouter = Backbone.Router.extend({
        
        routes: {
            ''  : 'index'
        },
        
        index: function () {
            Authentication.authorize(function () {
            var homepageView = new HomepageView();
            $('#content').html(homepageView.el);
            console.log(this.user)
            if (!this.user.admin)
            {
                document.getElementById("admin").style.display = 'none'
                document.getElementById("home").style.width = '80%'
            }
            });
        },
                
    });
    
    return HomepageRouter;
    
});