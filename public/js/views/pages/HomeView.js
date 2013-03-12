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
    },

    render: function(){
      this.$el.append(homeTemplate);

      var mapView = new MapView({el: $("#openLayersImage")});
      mapView.render();
      this.subviews.push(mapView);
    }

  });

  return HomeView;
  
});
