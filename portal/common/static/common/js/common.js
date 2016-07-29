define(['jquery'], function ($) {
    'use strict';
    function stringToFunction(str) {
        var arr = str.split(".");

        var fn = (window || this);

        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return fn;
    }

    String.prototype.format = function () {
        var formatted = this;
        for (var arg in arguments) {
            formatted = formatted.replace("{" + arg + "}", arguments[arg]);
        }
        return formatted;
    };

    // Avoid `console` errors in browsers that lack a console
    (function () {
        var method;
        var noop = function () {
        };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());

    function getEpoReferrer() {
        if (document.referrer.indexOf('epodreczniki') != -1 || document.referrer.indexOf('localhost') != -1) {
            if (document.referrer.match(/front\/search/)) {
                return document.referrer.replace(/(.+)front\/search(.+)/, "$1" + "front/");
            }
            else if (document.referrer.match(/front/)) {
                return document.referrer.replace(/(.+)front(.+)/, "$1" + "front/");
            }
            else if(document.referrer.match(/reader/)){
                return document.referrer.replace(/(.+)reader\/(.+)/, "$1" + "front/");            }
            else {
                return document.referrer;
            }
        } else {
            return null;
        }
    }

    function getParameter(paramName) {
        var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");

        for (i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] == paramName) {
                return unescape(val[1]);
            }
        }
        return null;
    }

    return {
        stringToFunction: stringToFunction,
        getEpoReferrer: getEpoReferrer,
        getParameter: getParameter
    };

});