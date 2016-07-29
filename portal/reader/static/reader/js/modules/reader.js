//>>includeStart("staticInclude", pragmas.staticInclude);

requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    }
});

//>>includeEnd("staticInclude");

require(['jquery',
    'domReady',
    'bowser',
    'load',
    'libs/avplayer/jquery.jplayer.dev',
    'libs/avplayer/dropup',
    'libs/videojs/wavesurfer.min',
    'libs/videojs/video.dev.mod',
    'libs/videojs/video-quality-selector',
    'libs/videojs/videojs.hotkeys',
    'libs/videojs/videojs.wavesurfer',
    'libs/videojs/videojs-overlay',
    'layout',
    'modules',
    'reader',
    'modules/womi_exercise',
    'modules/random_exercise',
    'modules/api/Utils',
    'modules/api/ReaderApi',
    'modules/api/AvatarApi',
    'modules/api/CommunicationApi',
    'modules/api/PlaceholderApi'], function ($, domReady, bowser, load, player, dr, wavesurfer, videojs, vqs, vhk, vjssurf, layout, modules, reader) {
    'use strict';
    domReady(function () {
        $('#search-input').keypress(function (ev) {
            if (bowser.msie || bowser.ios) {
                if (ev.keyCode == 13) {
                    $(this).parent()[0].submit();
                }
            }
        });
    });

});
