define([
  'baseview',
  '../map/MapView',
  '../partials/sidebar/SidebarView',
  'text!templates/pages/HomeView.html'
], function(Baseview, MapView, SideBarView, homeTemplate){

  var HomeView = Baseview.extend({
    initialize: function() {
        this.subviews = [];
        this.sidebarActive = false;
    },

    events: {
        "click #separator": function(e) { 
            if (this.sidebarActive) {
                //Doing this because I'm setting width's on multiple divs so a simple transition 
                //renders an animation in the wrong direction. Here, I can set the width and then
                //disappear the sidebar after the animation for the width change is done.
                //TODO: Make this not suck as much.
                $("#controlsContainer").css("width", "100%");
                $("#sidebar").addClass("hide");
                $("#separator").removeClass("extended");
                $("#collapseImage").attr("src", "../../img/arrow-right.png");
                this.sidebarActive = false;
            }
            else {
                $("#sidebar").removeClass("hide");
                $("#controlsContainer").css("width", "60%");
                $("#separator").addClass("extended");
                $("#collapseImage").attr("src", "../../img/arrow-left.png");
                this.sidebarActive = true;
            }
        }
    },

    render: function(){
      this.$el.append(homeTemplate);

      var mapView = new MapView({el: $("#openLayersImage")}),
            sidebarView = new SideBarView();

      mapView.render();
      sidebarView.render();
      this.subviews.push(mapView);
      this.subviews.push(sidebarView);
    }

  });

  return HomeView;
  
});
