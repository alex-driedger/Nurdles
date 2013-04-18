define([
       './utils/Parser',
       'underscore',
], function(Parser, _){
    var private = {};

    var OpenLayersUtil = {
        getFilterFeatures: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=exactAIS:LVI&authKey=tokencoin',
                success: function (response) {
                    var parser = new OpenLayers.Format.WFSDescribeFeatureType(),
                        parsedData = Parser.parseFeautures(parser.read(response.responseText));

                    callback(null, parsedData);
                },
                error: function(err) {
                    callback(err);
                }
            });

        },
                

    };

    return OpenLayersUtil;
});

