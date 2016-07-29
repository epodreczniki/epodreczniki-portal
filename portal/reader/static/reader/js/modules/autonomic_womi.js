require([
    'require',
    'jquery',
    'endpoint_tools',
    'domReady',
    'EpoAuth',
    'search_box',
    'play_and_learn',
    'modules/api/apilistener',
    'libs/avplayer/jquery.jplayer.dev',
    'libs/avplayer/dropup',
    'libs/videojs/wavesurfer.min',
    'libs/videojs/video.dev.mod',
    'libs/videojs/video-quality-selector',
    'libs/videojs/videojs.hotkeys',
    'libs/videojs/videojs.wavesurfer',
    'libs/videojs/videojs-overlay',
    'libs/IdGenerator',
    'portal_instance',
    'modules/api/Utils',
    'modules/core/cache/OpenQuestionCache',
    'modules/core/cache/WomiStateCache',
    'modules/api/ReaderApi',
    'JIC'], function (require, $, endpoint_tools, domReady, EpoAuth, search_box, play_and_learn, apilistener) {

    domReady(function () {
        EpoAuth.connectToPage($('#topbar').find('.right-navigation'));

        EpoAuth.ping();

        //search_box.init();

        play_and_learn.setLocationGenerator(function(){
            return $('#collection_about').attr('href');
        });
        play_and_learn.init();
    });

    var frame = $('#content-frame');
    var onresize = function () {
        frame.height($(window).height() - $('#topbar').height() - $('#contentbar').height());
    };

    $(window).resize(onresize);

    onresize();

    var iframe = frame.find('iframe');

    require(['reader.api'], function(ReaderApi) {
        var ra = new ReaderApi(null, true, iframe.data('src'));

        apilistener({}, window, iframe[0].contentWindow, ra, {}, {});

        iframe[0].src = iframe.data('src');
    });
});