define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/SearchedShipList.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, searchedShipListTemplated){
    var SearchedShipView = Baseview.extend({
        initialize: function(args) {
            this.load = false;
            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});

            this.bindTo(Backbone.globalEvents, "fetchedSearchedShips", this.transformShipData, this);
            this.bindTo(Backbone.globalEvents, "search", function(){
                this.load = true;
                this.render()
            }, this);
            this.bindTo(Backbone.globalEvents, "cachedSearchedShipsExist", this.renderCachedShips, this);
        },

        template: _.template(searchedShipListTemplated),

        events: {
            "click .shipHeader": "handleExpand",
            "click .locateButton": "handleLocate"
        },

        renderCachedShips: function(cachedShips) {
            this.ships = cachedShips;
            this.load = false;
            this.render();
        },

        transformShipData: function(eeShips) {
            var view = this;
            _.each(eeShips, function(eeShip) {
                view.ships.add(new Ship(eeShip.attributes));
            });

            Backbone.globalEvents.trigger("cacheSearchedShips", this.ships);
            this.load = false;
            this.display = true;
            this.render();

            if ($("#sidebar").hasClass("hide")) {
                Backbone.globalEvents.trigger("activatePane", $("#shiplist"));
                $("#separator").click();
            }
        },

        handleExpand: function(e) {
            var id = $(e.target).prop("id").split("-")[0];

            $("#" + id + "-details").slideToggle("hide");
            $("#" + id + "-arrow").prop("src", function(index, oldValue) {
                if (oldValue.match(/down/)) 
                    return oldValue.replace(/down/, "up");
                else
                    return oldValue.replace(/up/, "down");
            });
        },


        handleLocate: function(e) {
            e.stopPropagation();
            var ship = this.ships.findWhere({mmsi: $(e.target).prop("id").split("-")[0]});

            Backbone.globalEvents.trigger("locateShip", ship);
        },

        render: function () {
            this.fadeInViewElements((this.template({
                ships: this.ships,
                load: this.load,
                display: this.display
            })));

            return this;
        }
    });

    return SearchedShipView;
});

