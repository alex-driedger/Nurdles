define([
       'underscore',
       'basecollection',
       'models/Layer',
       './utils/Parser',
       './utils/Conf',
], function(_, BaseCollection, Layer, Parser, Conf){
    var private = {};

    var OpenLayersUtil = {
        setUpUtilFunctions: function() {
            String.prototype.capitalize = function(){
                return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
            };

            String.prototype.capitalizeShipAttributes = function(){
                return this.replace(/_/g, " ").replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
            };
        },

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

        parseLayerTypes: function(layers) {
            var parsedLayers = {};

            eeStoredLayers = layers.filter(function(layer) {
                return layer.get("isExactEarth");
            });
            customLayers = layers.reject(function(layer) {
                return (layer.get("isExactEarth") || layer.get("isBaseLayer"));
            });
            baseLayers = layers.filter(function(layer) {
                return layer.get("isBaseLayer");
            });

            parsedLayers.eeStoredLayers = new BaseCollection(eeStoredLayers, {model: Layer});
            parsedLayers.customLayers = new BaseCollection(customLayers, {model: Layer});
            parsedLayers.baseLayers = new BaseCollection(baseLayers, {model: Layer});

            return parsedLayers;
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

        convertXMLFilterToOLFilter: function(xmlFilter) {
            var parser, 
                xml,
                mapFilterConverted,
                newFilter,
                filters = [newFilter]

            parser = new OpenLayers.Format.Filter.v1_1_0 ();
            xml = new OpenLayers.Format.XML();

            olFilter = parser.read(xml.read(xmlFilter).documentElement);

            return olFilter;
        },

        mergeActiveFilters: function(newFilter, mapFilter) {
            var filters = [newFilter];

            if (mapFilter) {
                mapFilterConverted = this.convertXMLFilterToOLFilter(mapFilter);
                filters.push(mapFilterConverted);
            }

            newFilter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            });

            return newFilter;
        },

        constructLogicalFilter: function(filter) {
            var topLevelBin = filter.get("topLevelBin"),
                bins = filter.getBins(),
                util = this;

            var olFilter = new OpenLayers.Filter.Logical({
                type: topLevelBin.type 
            });

            _.each(topLevelBin.operators, function(operator) {
                if (operator.get && operator.get("isSubFilter")) 
                    olFilter.filters.push(util.constructLogicalFilter(operator));
                else
                    olFilter.filters.push(operator);
            });

            _.each(bins, function(bin) {
                var innerOlFilter = new OpenLayers.Filter.Logical({
                    type: bin.type
                });

                _.each(bin.operators, function(operator) {
                if (operator.get && operator.get("isSubFilter")) 
                    innerOlFilter.filters.push(util.constructLogicalFilter(operator));
                else
                    innerOlFilter.filters.push(operator);
                });

                olFilter.filters.push(innerOlFilter);
            });

            return olFilter;

        },

        createOpenLayersFilters: function(filters) {
            var olFilter = new OpenLayers.Filter.Logical({
                type: "&&"
            }),
                util = this;

            _.each(filters, function(filter) {
                olFilter.filters.push(util.constructLogicalFilter(filter));
            });

            var filter_1_0 = new OpenLayers.Format.Filter({version: "1.1.0"});
            var xml = new OpenLayers.Format.XML(); 
            var filter_param = xml.write(filter_1_0.write(olFilter));
            console.log(filter_param);

            return filter_param;
        },

        convertFilterToFilterParam: function(filter) {
            var outerFilter = new OpenLayers.Filter.Logical(),
                subFilter = new OpenLayers.Filter.Logical(),
                operands = [],
                operators = filter.getOperators();

            outerFilter.type = filter.get("logicalOperator");
            subFilter.type = "&&";

            for (var j = 0; j < operators.length; j++) {
                var operator = operators[j];
                if (operator.get && operator.get("isSubFilter")) {
                    subfilterOperands = this.convertFilterToFilterParam(operator);
                    _.each(subfilterOperands, function(operand) {
                        subFilter.filters.push(operand);
                    });
                    outerFilter.filters.push(subFilter);
                    operands.push(outerFilter);
                }
                else {
                    operands.push(operator);
                }
            }

            return operands;
        },

        addControlsToMap: function(view, currentFilter) {
            var map = view.model,
                oInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
                    name: "GetFeatureInfo",
                    url: 'https://owsdemo.exactearth.com/wms?authKey=tokencoin',
                        title: 'Identify features by clicking',
                    infoFormat: "application/vnd.ogc.gml",
                    queryVisible: true,
                    filter: this.convertXMLFilterToOLFilter(currentFilter),
                    eventListeners: {
                        getfeatureinfo: function(evt) {
                            view.showInfo(evt, view);
                            view.applyTrack(evt, view);
                        }
                    }
                });

            map.addControl(oInfoControl);
            oInfoControl.activate();

            /**************************
            * Measure Controls 
            **************************/
            var measureControl = new OpenLayers.Control.DynamicMeasure(
                OpenLayers.Handler.Path,
                {
                    name: "Measure",
                    persist: true
                }
            );

            map.addControl(measureControl);

            var graticuleControl = new OpenLayers.Control.Graticule({
                name: "Graticule",
                numPoints: 2,
                labelled: true,
                autoActivate: false
            });

            map.addControl(graticuleControl);
        },

        addActiveLayersToMap: function(eeLayers, userLayers, view) {
            console.log(eeLayers);
            var layersToAddToMap = [];
                haveActiveBaseLayer = false, //Used to keep track if we've added a baselayer yet.
                parsedLayers = this.parseLayerTypes(userLayers);
            

            //I made four collection because I figure this is easier than filtering on demand.
            //Especially in the view designed to allow a user to choose styles. That page is divided
            //into EE layers and custom layers -- this will make it easier
            view.eeStoredLayers = parsedLayers.eeStoredLayers;
            view.customLayers = parsedLayers.customLayers;
            view.baseLayers = parsedLayers.baseLayers;

            view.baseLayers.each(function(baseLayer) {
                var eeBaseLayer;
                switch (baseLayer.get("mapType")) {
                    case "OSM":
                        eeBaseLayer = new OpenLayers.Layer.OSM("OSMBaseMap", null,
                            { 
                                isBaseLayer: true, 
                                wrapDateLine: true,
                                transitionEffect: "resize",
                                tileOptions: {crossOriginKeyword: null}
                            });
                        break;
                    case "WMS":
                        eeBaseLayer = new OpenLayers.Layer.WMS("WMSBaseMap", "http://vmap0.tiles.osgeo.org/wms/vmap0", 
                            {
                                layers: "basic"
                            }, 
                            { 
                                isBaseLayer: true, 
                                wrapDateLine: true,
                                transitionEffect: "resize",
                                tileOptions: {crossOriginKeyword: null}
                            });
                        break;
                }

                view.model.addLayer(eeBaseLayer);

                if (baseLayer.get("active")) {
                    if (haveActiveBaseLayer) { //Dealing with duplicate base layer error
                        baseLayer.set("active", false);
                        baseLayer.update();
                    }

                    view.model.setBaseLayer(eeBaseLayer);
                    haveActiveBaseLayer = true;
                }
            });

            if (!haveActiveBaseLayer) {
                var basicMapLayer = new OpenLayers.Layer.OSM("OSMBaseMap", null,
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize",
                        tileOptions: {crossOriginKeyword: null}
                    });
                view.model.addLayer(basicMapLayer);

                var basicMapLayer = new OpenLayers.Layer.WMS("WMSBaseMap", "http://vmap0.tiles.osgeo.org/wms/vmap0", 
                    {layers: "basic"}, 
                    { 
                        isBaseLayer: true, 
                        wrapDateLine: true,
                        transitionEffect: "resize"
                    });
            }

            _.each(eeLayers, function(eeLayer) {
                var layer,
                    userLayer = userLayers.findWhere({name: eeLayer.Name}),
                    params = {};

                    if (userLayer)
                        params = userLayer.get("exactEarthParams");

                    layer = new OpenLayers.Layer.WMS(
                        eeLayer.Name, "https://owsdemo.exactearth.com/wms?authKey=tokencoin",
                        params,
                        {
                            singleTile: false,
                            ratio: 1,
                            yx: { 'EPSG:4326': true },
                            wrapDateLine: true
                        }
                    );

                    view.model.addLayer(layer);
                    view.model.setLayerIndex(layer, userLayer.get("order"));
                    layer.setVisibility(userLayer && userLayer.get("active"));
            });


            //Combine ee and custom layers since they can intermingle when assigning order
            userLayers = userLayers.reject(function(layer) {
                return layer.get("isBaseLayer");
            });

            view.userLayers = new BaseCollection(userLayers, {model: Layer});

            view.layersLoaded = true;
            view.loadInitialFilters();

        },

        convertLayerToOLLayer: function(horizonLayer) {
            var layer;

            switch (horizonLayer.mapType) {
                case "WMS":
                    layer = new OpenLayers.Layer.WMS();
                    break;
                case "OSM":
                    layer = new OpenLayers.Layer.OSM();
                    break;
            }
            layer.name = horizonLayer.name;
            layer.url = horizonLayer.url;
            layer.params = horizonLayer.exactEarthParams;
            layer.isBaseLayer = horizonLayer.isBaseLayer;
            layer.options = {
                    singleTile: false,
                    ratio: 1,
                    yx: { 'EPSG:4326': true },
                    wrapDateLine: true
            };

            view.model.addLayer(layer);
            view.model.setLayerIndex(layer, userLayer.get("order"));
            layer.setVisibility(userLayer && userLayer.get("active"));
            
        },

        getShipCount: function(bounds, currentFilter, callback) {
            var filter,
                mapProjection = this.getProjection();

            filter = new OpenLayers.Filter.Spatial({ 
                type: OpenLayers.Filter.Spatial.BBOX, 
                property: "position", 
                value: bounds.transform(mapProjection.projection, mapProjection.displayProjection)
            });

            if (currentFilter instanceof Array && currentFilter.length != 0) {
                currentFilter = this.createOpenLayersFilters(currentFilter);
                filter = this.mergeActiveFilters(filter, currentFilter);

                var  wfsProtocol = new OpenLayers.Protocol.WFS.v1_1_0({ 
                    url: "/proxy/getWFSFeatures?url=https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=GetFeature&typeName=exactAIS:LVI&authKey=tokencoin", 
                    featurePrefix: "", 
                    featureType: "exactAIS:LVI",
                }); 

                wfsProtocol.read ({ 
                    filter: filter, 
                    callback: function(response) {
                        Backbone.globalEvents.trigger("fetchedShipCount", response.numberOfFeatures);

                        if (_.isFunction(callback)) {
                            callback(response.numberOfFeatures);
                        }
                    },
                    readOptions: {output: "object"},
                    resultType: "hits",
                    maxFeatures: null,
                    scope: new OpenLayers.Strategy.Fixed
                }); 
            }
        }
    };


    return OpenLayersUtil;
});

