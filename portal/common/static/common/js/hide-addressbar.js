(function () {
    'use strict';

    if (navigator.platform.match(/iPhone|iPod/i)) {
        window.MBP = window.MBP || {};
        
        /**
         * Normalized hide address bar for iOS & Android
         * (c) Scott Jehl, scottjehl.com
         * MIT License
         */
    
        // If we split this up into two functions we can reuse
        // this function if we aren't doing full page reloads.
    
        // If we cache this we don't need to re-calibrate everytime we call
        // the hide url bar
    
        MBP.BODY_SCROLL_TOP = false;
    
        // So we don't redefine this function everytime we
        // we call hideUrlBar
        MBP.getScrollTop = function () {
            var win = window;
            var doc = document;
    
            return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
        };
    
        // It should be up to the mobile
        MBP.hideUrlBar = function () {
            var win = window;
    
            // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
            if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
                win.scrollTo(0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1);
            }
        };
    
        MBP.hideUrlBarOnLoad = function () {
            var win = window;
            var doc = win.document;
            var bodycheck;
    
            // If there's a hash, or addEventListener is undefined, stop here
            if (!location.hash && win.addEventListener) {
    
                // scroll to 1
                window.scrollTo(0, 1);
                MBP.BODY_SCROLL_TOP = 1;
    
                // reset to 0 on bodyready, if needed
                bodycheck = setInterval(function () {
                    if (doc.body) {
                        clearInterval(bodycheck);
                        MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                        MBP.hideUrlBar();
                    }
                }, 15);
    
                win.addEventListener('load', function () {
                    setTimeout(function () {
                        // at load, if user hasn't scrolled more than 20 or so...
                        if (MBP.getScrollTop() < 20) {
                            // reset to hide addr bar at onload
                            MBP.hideUrlBar();
                        }
                    }, 0);
                });
            }
        };
    
        MBP.hideUrlBarOnLoad();
        
        // Full screen mode for web-app in 4" iPhones & iPods
        
        MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    
        if (screen.height === 568) {
            if (MBP.viewportmeta) {
                MBP.viewportmeta.content = MBP.viewportmeta.content
                    .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
                    .replace(/\bwidth\s*=\s*device-width\b/, '');
            }
        }
    }

}());