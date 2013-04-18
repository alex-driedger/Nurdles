define([
       'underscore',
], function(_){
    var private = {};

    var Parser = {
        parseFeautures: function(data) {
            var featureTypes = data.featureTypes,
                features = [];

            _.each(featureTypes, function(type) {
                _.each(type.properties, function(property) {
                    features.push({
                        name: property.name,
                        type: property.localType
                    });
                });
            });

            return features;
        },
                

    };

    return Parser;
});


