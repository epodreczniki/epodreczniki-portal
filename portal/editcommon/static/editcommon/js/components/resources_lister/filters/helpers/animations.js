define([
    'jquery',
    'underscore'
], function(
    $,
    _
) {

    // Needs to be called with context set.

    var toggleElement = function(element, effect, options) {
        var $el = this.$(element),
            opts = options || {};

    };

    var showElement = function(element, effect, options) {
        this.$(element).velocity(effect, options);
    };

    return {

    }

})

