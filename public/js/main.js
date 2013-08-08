// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    bootstrap: 'libs/bootstrap/bootstrap.min',
    jqueryui: 'libs/jquery/jquery-ui.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    baseview: 'views/BaseView',
    basecollection: 'collections/BaseCollection',
    templates: '../templates'
  },

  shim: {
      bootstrap: {
          deps: ['jquery', 'jqueryui']
      },

      underscore: { 
          deps: ['jquery'],
          exports: "_"
      },

      backbone: {
          deps: ['underscore'],
          exports: 'Backbone'
      }
  },
});

require(['app'], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});