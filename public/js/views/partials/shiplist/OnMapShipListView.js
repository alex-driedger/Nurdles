define([
  'baseview',
  'openlayersutil',
  'basecollection',
  '../../../models/Ship',
  'text!templates/partials/shiplist/OnMapShipListView.html'
], function(Baseview, OpenLayersUtil, BaseCollection, Ship, shiplistOnMapTemplate){
    var OnMapShipListView = Baseview.extend({
        initialize: function(args) {
            var view = this;

            this.initArgs(args);
            this.ships = new BaseCollection([], {model: Ship});

            this.bindTo(Backbone.globalEvents, "fetchedShipsList", this.displayShipList, this);
            this.bindTo(Backbone.globalEvents, "tooManyShipsToFetch", function(shipCount) {
                $("#onMapShipListContainer").html("<div class='vtupadded10 lpadding20'>Too many ships to retrieve. Please zoom in.</div>");
            }, this);
            this.bindTo(Backbone.globalEvents, "refreshShipList", function() {
                view.ships.reset();
                view.load = true;
                view.showLoadScreen();
                Backbone.globalEvents.trigger("getShipList");
            }, this);

            if (this.load) {
                Backbone.globalEvents.trigger("getShipList");
            }
        },

        template: _.template(shiplistOnMapTemplate),

        events: {
            "click .shipHeader": "handleExpand",
            "click .locateButton": "handleLocate",
            "click #downloadShipList": "downloadShipList",
            "click #getShipList": "handleGetShipList"
        },

        handleGetShipList: function() {
            this.load = true;
            this.showLoadScreen();
            Backbone.globalEvents.trigger("getShipList");
        },

        downloadShipList: function(e) {
            var serializedShipList = this.serializeShipList();
            e.preventDefault();
            console.log(this.ships);
            $("#serializedShipList").val(serializedShipList);
            console.log($("#serializedShipList").val());
            $("#shipListForm").submit();
        },

        serializeShipList: function() {
            var serializedShipList = "",
                jsonShipList = {
                    headers: "",
                    ships: []
                },
                ship = this.ships.at(0);

            for (var key in ship.attributes) {
                jsonShipList.headers += key + ", ";
            }

            jsonShipList.headers = jsonShipList.headers.substring(0, jsonShipList.headers.length - 1);

            this.ships.each(function(ship) {
                jsonShipList.ships.push(ship.attributes);
            });

            return JSON.stringify(jsonShipList);
        },

        displayShipList: function(eeShips) {
            console.log(eeShips);
            var view = this;
            _.each(eeShips, function(eeShip) {
                view.ships.add(new Ship(eeShip.attributes));
            });

            this.load = false;
            this.refreshed = true;
            this.reRender();
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

        preRender: function(callback) {

            return this;
        },

        render: function () {
            this.fadeInViewElements((this.template({
                ships: this.ships,
                load: this.load,
                refreshed: this.refreshed
            })));

            return this;
        },

        showLoadScreen: function () {
            this.$el.html((this.template({
                ships: this.ships,
                load: this.load
            })));

            return this;
        }
    });

    return OnMapShipListView;
});

