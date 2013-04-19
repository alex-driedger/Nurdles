define([
       'underscore',
       './utils/Parser',
       './utils/conf',
], function(_, Parser, Conf){
    var private = {};

    var OpenLayersUtil = {
        getFilterFeatures: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=exactAIS:LVI&authKey=tokencoin',
                proxy: Conf.featureSetProxy,
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

        determineNumberOfInputs: function(propertyType) {
            propertyType = propertyType.toLowerCase();
            console.log(propertyType);
            switch (propertyType) {
                case "string":
                    return 1;
                    break;
                case "integer":
                case "int":
                case "double":
                case "long":
                case "decimal":
                    return 2;
                    break;
            }

            return -1; //This means it's a geometric constraint
        }
    };

    return OpenLayersUtil;
});

