define([], function() {

    var stringToFloat = function(str) {

        var str = str.replace(/,/g, '.');

        return parseFloat(str);
    
    };

    return {
        stringToFloat: stringToFloat
    }

});
