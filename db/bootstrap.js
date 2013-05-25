
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            layerDAL = require("./access/layerdal");

        userDAL.create("chris", "password", "tokencoin", function(err, user) {
            if (user) {
                layerDAL.create(user._id, {
                    title: "ExactAIS:LVI",
                    name: "exactAIS:LVI",
                    authKey: "tokencoin",
                    isBaseLayer: false,
                    isExactEarth: true,
                    exactEarthParams: {
                        LAYERS: "exactAIS:LVI",
                        STYLES: "VesselByType",
                        format: "image/png",
                        transparent: "true"
                    },
                    active: true,
                    order: 1
                }, function(err, layer) {} );

                layerDAL.create(user._id, {
                    title: "exactAIS:HT30",
                    name: "exactAIS:HT30",
                    authKey: "tokencoin",
                    isBaseLayer: false,
                    isExactEarth: true,
                    exactEarthParams: {
                        LAYERS: "exactAIS:HT30",
                        STYLES: "Track",
                        format: "image/png",
                        transparent: "true"
                    },
                    active: true,
                    order: 2
                }, function(err, layer) {} );
            }
        });
    }
};
