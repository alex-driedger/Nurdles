define([
  'baseview',
  '../map/MapView',
  '../partials/sidebar/SidebarView',
  '../partials/map/ViewLayersView',
  'text!templates/pages/HomeView.html'
], function(Baseview, MapView, SideBarView, ViewLayersView, homeTemplate){

  var HomeView = Baseview.extend({
    initialize: function() {
        this.subviews = [];
        this.sidebarActive = false;

        this.bindTo(Backbone.globalEvents, "showLoader", this.showLoader, this);
        this.bindTo(Backbone.globalEvents, "hideLoader", this.hideLoader, this);

        this.bindTo(Backbone.globalEvents, "layersFetched", this.loadLayersIntoDropDown, this);
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

    loadLayersIntoDropDown: function(layers, baseLayers) {
        var viewLayersView = new ViewLayersView({
            layers: layers,
            baseLayers: baseLayers
        });

        $("#viewLayerContainer").html(viewLayersView.preRender().$el);
        viewLayersView.render();
        this.addSubView(viewLayersView);
    },

    showLoader: function(e) {
        $("#loader").removeClass("hide");
    },

    hideLoader: function(e) {
        $("#loader").addClass("hide");
    },

    render: function(){
      this.$el.append(homeTemplate);

      var mapView = new MapView({el: $("#openLayersImage")}),
            sidebarView = new SideBarView();

      sidebarView.render();
      this.subviews.push(mapView);
      this.subviews.push(sidebarView);
    }

  });

  return HomeView;
  
});
