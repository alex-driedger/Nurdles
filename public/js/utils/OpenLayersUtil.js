define([
       'underscore',
       './utils/Parser',
       './utils/Conf',
], function(_, Parser, Conf){
    var private = {};

    var OpenLayersUtil = {
        getProjection: function() {
            return {
                projection: new OpenLayers.Projection("EPSG:900913"), 
                displayProjection: new OpenLayers.Projection("EPSG:4326")
            };
        },

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

        getLayers: function(layerCapabilitiesURL, callback) {
            var url = request = null;

            if (layerCapabilitiesURL === null)
                layerCapabilitiesURL = 'https://owsdemo.exactearth.com/ows?service=wms&version=1.3.0&request=GetCapabilities&authKey=tokencoin';

            request = OpenLayers.Request.GET({
                url: layerCapabilitiesURL,
                proxy: Conf.getCapabilitiesProxy,
                success: function (response) {
                    var capabilities = JSON.parse(response.responseText),
                        layers = _.toArray(capabilities.WMS_Capabilities.Capability.Layer.Layer);

                    callback(null, layers);
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
        },

        convertFilterToFilterParam: function(filters) {
            var olFilters = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND 
            });

            for (var i = 0, len = filters.length; i< len; i++) {
                for (var j = 0, olen = filters[i].operators.length; j < olen; j++) {
                    olFilters.filters.push(filters[i].operators[j]);
                }
            }

            var filter_1_0 = new OpenLayers.Format.Filter({version: "1.1.0"});
            var xml = new OpenLayers.Format.XML(); 
            var filter_param = xml.write(filter_1_0.write(olFilters));
            console.log(filter_param);

            return filter_param;
            
        },
    };

    return OpenLayersUtil;
});

