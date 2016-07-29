var geReqDoge = '{{ STATIC_URL }}3rdparty/ge/js/doge.js';
var ge = {jsPath: '{{ STATIC_URL }}3rdparty/ge/js' };
require.config({
    shim: {

        'ge.jquery-ui': {
            deps: ["jquery"],
            exports: "jquery-ui"
        },
        'ge.createjs': {
            exports: "createjs"
        },
        'ge.movieclip': {
            deps: ["ge.createjs"],
            exports: "createjs.MovieClip"
        },
        'ge.soundjs': {
            deps: ["ge.createjs"],
            exports: "createjs.Sound"
        }
    },
    paths: {

        'ge.jquery-ui': ge.jsPath + '/libs/jquery-ui.min',
        'ge.createjs': ge.jsPath + '/libs/createjs',
        'ge.movieclip': ge.jsPath + '/libs/movieclip-0.7.1.min',
        'ge.soundjs': ge.jsPath + '/libs/soundjs-NEXT.min'
    }
});
define(['modules/core/Logger', geReqDoge], function (Logger, doge) {
    this.name = 'geConfigLoader';

    Logger.log('loaded doge from: ' + geReqDoge, this);

});