requirejs.config({
    paths: {
        mathjax: '{{ STATIC_URL }}{{ EXTERNAL_ENGINES.mathjax.url_template }}'
    }
});

require([
    'require',
    'jquery',
    'domReady',
    'bowser',
    'layout',
    'modules/core/WomiManager',
    'modules/core/ReaderKernel',
    'selectedLayout', //'modules/layouts/womi_render/WomiPreviewLayout',
    'modules/utils/ReaderUtils',
    'modules/core/Registry',
    'modules/core/engines/GEAnimation',
    'modules/core/womi/embed/WOMIMovieContainer',
    'modules/womi_exercise',
    'modules/random_exercise',
    'modules/api/Utils',
    'modules/api/ReaderApi',
    'modules/api/AvatarApi',
    'modules/api/CommunicationApi',
    'modules/api/PlaceholderApi',
    'libs/avplayer/jquery.jplayer.dev',
    'libs/videojs/wavesurfer.min',
    'libs/videojs/video.dev.mod',
    'libs/videojs/video-quality-selector',
    'libs/videojs/videojs.hotkeys',
    'libs/videojs/videojs.wavesurfer',
    'libs/videojs/videojs-overlay',
    'libs/avplayer/dropup',
    'JIC'
], function (require, $, domReady, bowser, layout, womi, ReaderKernel, WomiPreviewLayout, Utils, Registry, GEAnimation, WOMIMovieContainer, a2, a3, ApiUtils) {
    'use strict';

    Utils.setValidDomain();

    var kernel = new ReaderKernel({launchInitProc: false});

    var defaultLayout = new WomiPreviewLayout({kernel: kernel});
    domReady(function () {
        kernel.run();

        $('#sh-info').click(function () {
            $('#top-info').slideToggle();
        });

        ApiUtils.bookpartIDGenerator = function(){
            return window.location.pathname.replace(/\//g, '_');
        };

        var commonBase = require('common_base');

        var schema = commonBase.getParameter('forceSchema');

        if (schema) {
            var base = $('base');
            if (schema == 'ssl') {
                base.attr('href', 'https:' + base.attr('href'));
            }
            if (schema == 'plain') {
                base.attr('href', 'http:' + base.attr('href'));
            }
        }

        var superScript = commonBase.getParameter('superScript');

        var roles = commonBase.getParameter('roles');

        Registry.get('engines')['ge_animation'] = GEAnimation;


        if (superScript) {
            require([superScript], function () {
            }, function () {
            });
        }

        var dynamic = $('#dynamic-womi');
        dynamic.height($(window).height() - 50);
        var other = $('#other-placeholder');
        if (dynamic.length) {
            require(['placeholder.api'], function (PlaceholderApi) {
                var api = new PlaceholderApi(dynamic, false);
                var ver = (dynamic.data('womi-version') || '1');
                var useVer = dynamic.data('use-version');

                var apicall = 'getWomiVersionContainer';
                var params = [dynamic.data('womi-id'), ver, '100%'];

                if (!useVer) {
                    apicall = 'getWomiContainer';
                    params = [dynamic.data('womi-id') + '', '100%'];
                }

                api[apicall].apply(api, params.concat([function (container, manifest) {
                    dynamic.append(container);
                    if (roles) {
                        container.data('roles', roles);
                    }
                    var ei = $('#engine-info');
                    ei.text(ei.text().replace('engine: ', 'engine: ' + manifest.engine));
                    womi.load(function () {
                        require(['mathjax'], function () {
                            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
                        });
                    });//2(dynamic);
                }]));

            });
            //womi.loadSingleWOMI(dynamic.data('womi-id'), dynamic);
        } else {
            womi.load();
        }

    });

});
