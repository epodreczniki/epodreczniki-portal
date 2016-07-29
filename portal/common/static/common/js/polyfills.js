(function () {
    'use strict';

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
    if (!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            }
        });
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    if (!String.prototype.endsWith) {
        Object.defineProperty(String.prototype, 'endsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (searchString, position) {
                position = position || this.length;
                position = position - searchString.length;
                return this.lastIndexOf(searchString) === position;
            }
        });
    }

    try{
        var customEventTest = new CustomEvent();
    }catch(err){
        console.log("CustomEvent not supported !!!");
        (function () {
            function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }

            window.CustomEvent = CustomEvent;
        })();
    }
//    if (typeof window.CustomEvent === 'undefined') {
//    (function () {
//        function CustomEvent(event, params) {
//            params = params || { bubbles: false, cancelable: false, detail: undefined };
//            var evt = document.createEvent('CustomEvent');
//            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
//            return evt;
//        }
//
//        window.CustomEvent = CustomEvent;
//    })();
//    }
}());