define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/ratecleanliness.html',
    'jquerycookie',
    'authentication',
], function ($, _, Backbone, ratecleanliness, jQueryCookie, Authentication) {
    
    var RateView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.render();
        },
        
        // Define the events used when binding.
        events: {
            // IF THE LOGIN BUTTON IS PRESSED, FIRE LOGIN FUNCTION
            'click .login-button' : 'rate',
            'change .form-control' : 'updateRating'
        },
        updateRating: function(event)
        {
            var c = $('#slider').val()
            if (c == 1)
            {
                $('#rating').html("Clean")
            }
            if (c == 2)
            {
                $('#rating').html("Dirty")
            }
            if (c == 3)
            {
                $('#rating').html("Really Dirty")
            }
            if (c == 4)
            {
                $('#rating').html("Garbage Dump")
            }
        },
          // This is where you change what happens when the button is pressed 
        rate: function (event) {
            event.preventDefault();
            // THIS IS WHERE U CAN SEND THE LOCATION BACK TO THE SERVER :O
            navigator.geolocation.getCurrentPosition(function(position)
            {
                console.log(position.coords.longitude)
            })
            /*var beachname = $('input[name=beachname]').val();
            var cleanliness = $('input[name=cleanliness]').val();
            console.log(beachname)
            console.log(cleanliness)
            $.ajax({
                type: 'POST',
                url: '/api/user/rate',
                data: {
                    username: beachname,
                    passwords: cleanliness
                },
                success: function (data, status, xhr) {
                    Authentication.rate( data.userId );
                },
                error: function (xhr, status, error) {
                    console.log(error)
                    // On error, change the input whatever to ''
                    //$('input[name=password]').val('');
                },
            });*/
        },
        
        render: function () {
            this.$el.html(ratecleanliness);
            return this;
        },
        
    });
    
    return RateView;
    
});
