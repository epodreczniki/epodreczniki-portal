define([], function(){
    'use strict';

    /* TODO: I don't get this logic */
    var positiveTest = /Mobi|Mini/;
    var negativeTest = /iPad/;
    var ret = {};
    ret.isMobile = positiveTest.test(window.navigator.userAgent) && !negativeTest.test(window.navigator.userAgent);

    var mobile = /Android|iPad|iPhone|iPod|Windows Phone|ARM/;

    ret.isDesktop = !mobile.test(window.navigator.userAgent);
    return ret;
});
