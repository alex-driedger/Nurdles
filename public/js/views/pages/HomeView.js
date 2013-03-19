define([
  'jquery',
  'underscore',
  'backbone',
  '../map/MapView',
  'text!templates/pages/HomeView.html',
  'text!templates/map/MapView.html'
], function($, _, Backbone, MapView, homeTemplate, mapTemplate){

  var HomeView = Backbone.View.extend({
    initialize: function() {
        this.subviews = [];
        this.sidebarActive = false;
    },

    events: {
        "click #separator": function(e) { 
            if (this.sidebarActive) {
                $("#content").width("100%");
                //Doing this because I'm setting width's on multiple divs so a simple transition 
                //renders an animation in the wrong direction. Here, I can set the width and then
                //disappear the sidebar after the animation for the width change is done.
                //TODO: Make this not suck as much.
                setTimeout(function(){ $("#main").removeClass("use-sidebar");}, 300);
                $("#sidebar").addClass("hide");
                $("#separator").addClass("extended");
                this.sidebarActive = false;
            }
            else {
                $("#main").addClass("use-sidebar");
                $("#sidebar").removeClass("hide");
                $("#separator").removeClass("extended");
                $("#content").width("");
                this.sidebarActive = true;
            }
        }
    },

    render: function(){
      this.$el.append(homeTemplate);

        console.log(this.el);

      var mapView = new MapView({el: $("#openLayersImage")});
      mapView.render();
      this.subviews.push(mapView);
    }

  });

  return HomeView;
  
});
