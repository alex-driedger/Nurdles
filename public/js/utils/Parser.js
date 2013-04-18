define([
       'underscore',
], function(_){
    var private = {};

    var Parser = {
        getFilterFeatures: function(callback) {
            var request = OpenLayers.Request.GET({
                url: 'https://owsdemo.exactearth.com/ows?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=exactAIS:LVI&authKey=tokencoin',
                success: function (response) {
                    var parser = new OpenLayers.Format.WFSDescribeFeatureType();
                    console.log(parser.read(response.responseText));
                }
            });

        },
                

    };

    return Parser;
});


