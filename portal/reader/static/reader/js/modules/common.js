function __makePaths() {

    var __staticUrl = '{{ STATIC_URL }}';

    var __old = {
        'epo.custom_lib1.lib1': '{{ STATIC_URL }}3rdparty/epo/custom_lib1/lib1',
        'epo.createjs.2013.02.12': '{{ STATIC_URL }}3rdparty/epo/createjs/createjs-2013.02.12.min',
        'epo.createjs.2013.05.14': '{{ STATIC_URL }}3rdparty/epo/createjs/createjs-2013.05.14.min',
        'epo.createjs.2013.09.25': '{{ STATIC_URL }}3rdparty/epo/createjs/createjs-2013.09.25.min',
        'epo.createjs.2013.12.12': '{{ STATIC_URL }}3rdparty/epo/createjs/createjs-2013.12.12.min',
        'epo.createjs.movieclip.0.6.0': '{{ STATIC_URL }}3rdparty/epo/createjs/movieclip-0.6.0.min',
        'epo.createjs.movieclip.0.6.1': '{{ STATIC_URL }}3rdparty/epo/createjs/movieclip-0.6.1.min',
        'epo.createjs.movieclip.0.7.0': '{{ STATIC_URL }}3rdparty/epo/createjs/movieclip-0.7.0.min',
        'epo.createjs.movieclip.0.7.1': '{{ STATIC_URL }}3rdparty/epo/createjs/movieclip-0.7.1.min'
    };

    function merge_options(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    var __some = {
        'functions': '{{ STATIC_URL }}3rdparty/pl/functions'
    };

    return merge_options(__old, __some);
}

requirejs.config({

    paths: __makePaths(),
    waitSeconds: 200
});
require([
    'libs/jquery.ba-throttle-debounce',
    'libs/jquery.hoverIntent.r7.min',
    'libs/jquery.jscrollpane',
    'libs/jquery.tinysort',
    'libs/jquery.ui.touch-punch',
    'libs/jquery.fittext',
    'libs/jquery.panzoom',
    //'libs/jquery.anythingzoomer',
    'libs/jquery.imageLens',
    'libs/rawconfig',
    'libs/IdGenerator',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json',
    'bowser',
    'portal_instance',
    'endpoint_tools',
    'modules/core/cache/WomiStateCache',
    'modules/core/cache/OpenQuestionCache',
    'JIC'], function () {
    'use strict';

});
