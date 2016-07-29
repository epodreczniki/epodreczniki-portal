/**
 * require.js plugin
 *
 * Automatically wrap define/require callbacks. (Experimental)
 */
;(function (window, Raven) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        //can't use wraper for define - it is little buggy with raven for only function define wraps
        //window.define = Raven.wrap({ deep: false }, define);
        window.require = Raven.wrap({deep: false}, require);
    }

}(window, window.Raven));
