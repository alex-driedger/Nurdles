require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        },
        mocha: {
            exports: 'mocha'
        },
        chai: {
            exports: 'chai'
        },
    },
    paths: {
        mocha: '../test/mocha',
        chai: '../test/chai',
        jquery: '../public/js/libs/jquery/jquery-min',
        jqueryui: '../public/js/libs/jquery/jquery-ui.min',
        underscore: '../public/js/libs/underscore/underscore-min',
        backbone: '../public/js/libs/backbone/backbone-min',
        baseview: '../public/js/views/BaseView',
        basecollection: '../public/js/collections/BaseCollection',
        openlayersutil: "../public/js/utils/OpenLayersUtil",
        templates: '../public/templates'
    },

});

require(['underscore', 'jquery', 'mocha', 'chai'], function(_, $, mocha, chai) {

  // Chai
  this.assert = chai.assert;
  this.expect = chai.expect;
  
  // Mocha
  mocha.setup({ui: 'bdd', ignoreLeaks: true});

  var specs = [];

  specs.push('Base_view_spec');
  

  require(specs, function(){
    $(function(){
      mocha.run();//.globals(['Backbone']);
    });
  });

});
