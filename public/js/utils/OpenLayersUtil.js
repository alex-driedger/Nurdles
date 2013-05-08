define([
       'underscore',
       './utils/Parser',
       './utils/Conf',
], function(_, Parser, Conf){
    var private = {};

    var OpenLayersUtil = {
        getFeatureFields: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=exactAIS:LVI&authKey=tokencoin',
                proxy: Conf.featureSetProxy,
                success: function (response) {
                    var parser = new OpenLayers.Format.WFSDescribeFeatureType(),
                        parsedData = Parser.parseFeatures(parser.read(response.responseText));

                    callback(null, parsedData);
                },
                error: function(err) {
                    callback(err);
                }
            });
        },

        getFilterCapabilities: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=GetCapabilities&authKey=tokencoin',
                proxy: Conf.getCapabilitiesProxy,
                success: function (response) {
                    var capabilities = JSON.parse(response.responseText),
                        filterCapabilities = _.toArray(capabilities)[0]["ogc:Filter_Capabilities"];

                    callback(null, filterCapabilities);
                },
                error: function(err) {
                    callback(err);
                }
            });
        },

        getLayerStyles: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wms&version=1.3.0&request=GetCapabilities&authKey=tokencoin',
                proxy: Conf.getCapabilitiesProxy,
                success: function (response) {
                    var capabilities = JSON.parse(response.responseText);
                        layerStyles = _.toArray(capabilities.WMS_Capabilities.Capability.Layer.Layer);

                    console.log("CAPABILITIES: ", layerStyles);
                },
                error: function(err) {
                    callback(err);
                }
            });
        },

        getTypeDropdownValues: function(type) {
            var values = Conf.scalarFilterCapabilties.byType[type];

            return values || ["na"];
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

