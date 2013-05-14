
module.exports = {
    load: function() {
        var userDAL = require("./access/userdal"),
            layerDAL = require("./access/layerdal");

        userDAL.create("chris", "password", "tokencoin", function(err, user) {
            if (user) {
                layerDAL.create(user._id, {
                    title: "EE LVI",
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
                    active: true
                }, function(err, layer) {} );
            }
        });
    }
};
