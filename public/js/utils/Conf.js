define([
], function(){
    var Conf = {

        scalarFilterCapabilties: {
            byType: {
                "string": ["==", "!="],
                "integer": ["==", "!=", ">", "<", ">=", "<=", ".."],
                "int": ["==", "!=", ">", "<", ">=", "<=", ".."],
                "double": ["==", "!=", ">", "<", ">=", "<=", ".."],
                "long": ["==", "!=", ">", "<", ">=", "<=", ".."],
                "decimal": ["==", "!=", ">", "<", ">=", "<=", ".."]
            },
            1: ["==", "!=", ">", "<", ">=", "<="],
            2: [".."]
        },

        featureSetProxy: "/proxy/features?url=",
        getCapabilitiesProxy: "/proxy/getCapabilities?url="
    };

    return Conf;
});
