var self = {
    download: function(req, res) {
        var shipList = JSON.parse(req.body.serializedShipList);
        var csv = shipList.headers + "\n";

        for (var i = 0, len = shipList.ships.length; i < len; i++) {
            for (var key in shipList.ships[i]) {
                csv += shipList.ships[i][key] + ", ";
            }
            csv = csv.substring(0, csv.length - 2); // To remove final comma in the row
            csv += "\n";
        }
        res.setHeader('Content-disposition', "attachment; filename=shiplist.csv");
        res.setHeader('Content-type', "application");

        res.send(csv);
    }

};

module.exports = self;


