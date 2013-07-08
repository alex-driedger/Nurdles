define([
  'baseview',
  'openlayersutil',
  './SearchedShipListView',
  './SearchModalView',
  'text!templates/partials/searches/SearchView.html'
], function(Baseview, OpenLayersUtil, SearchedShipList, SearchModalView, searchViewTemplate){
    var private = {
        numberTypes: [],
        stringTypes: [],
        spatialTypes: []
    };

    var SearchView = Baseview.extend({
        initialize: function(args) {
            this.initArgs(args);
        },

        template: _.template(searchViewTemplate),

        events: {
            "click .feature": "addNewFilter"
        },

        addNewFilter: function(e) {
            e.preventDefault();
            var modal = new SearchModalView();
            modal.attachToPopup($("#modalPopup"));
            modal.render();

            modal.show();
        },

        preRender: function(containingDiv, callback) {
            var view = this;
            this.$el.appendTo(containingDiv)
            OpenLayersUtil.getFeatureFields(function(err, response) {
                private.features = response;
                private.numberTypes = _.filter(response, function(feature) {
                    return (
                        feature.type == "integer" ||
                        feature.type == "int" ||
                        feature.type == "double" ||
                        feature.type == "long" ||
                        feature.type == "decimal"
                    );
                });
                private.stringTypes = _.where(response, {type: "string"});

                for (var i = 0, len = response.length; i < len; i++) {
                    if ((!_.contains(private.numberTypes, response[i])) && (!_.contains(private.stringTypes, response[i])))
                        private.spatialTypes.push(response[i]);
                }

                view.fadeInViewElements(view.template({
                    numberTypes: private.numberTypes,
                    stringTypes: private.stringTypes,
                    spatialTypes: private.spatialTypes
                }));
                callback();
            });

            return this;
        },

        render: function () {

            return this;
        }
    });

    return SearchView;
});


