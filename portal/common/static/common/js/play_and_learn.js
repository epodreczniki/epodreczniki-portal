define(['jquery', 'underscore'], function ($, _) {

    var locationGenerator = function(){
        return null;
    };
    function init() {
        var collectionMeta = $('#collection-metadata');

        var baseLocation = locationGenerator() || (window.location.origin + window.location.pathname);

        var mappings = {};
        if (collectionMeta.data('attribute-collection-toc-mappings')) {
            _.each(collectionMeta.data('attribute-collection-toc-mappings').split(' '), function (element) {
                var e = element.split(':');
                mappings[e[0]] = baseLocation + '/m/' + e[1] + '/auto';
            });
        }

        window.addEventListener("message", function(event) {
            if (event.data == 'collectionTocMappings') {
                event.source.postMessage({
                    type: 'receiveCollectionTocMappings',
                    mappings: JSON.stringify(mappings)
                }, '*');
            }
        }, false);

        $('.toc-womi-iframe').each(function() {$(this).attr('src', $(this).attr('data-src'))});

        function callClick(id) {
            if (mappings[id] === undefined) {
                return
            }
            window.location.href = mappings[id];
        }

        var pnlBtn = $('#pnl-button');
        if (pnlBtn.length) {
            var pnlMap = $('#pnl-map');

            if(pnlMap.length == 0){
                pnlBtn.hide();
                return;
            }

            var allIds = pnlMap.find('[id]');

            var styles = pnlMap.find('style').text();

            pnlMap.find('svg').css('background-color', '#d7edfb');

            var validIds = [];

            allIds.each(function () {
                var el = $(this);
                if (styles.indexOf(el.attr('id')) > 0) {
                    validIds.push(el);
                }
            });

            $(validIds).each(function () {
                var t = $(this);
                t.click(function () {
                    callClick(t.attr('id'));
                    return false;
                });
            });
            //pnlMap.css('margin-top', 40);
            var uc = $('#usable-close');
            uc.click(function () {
                $.fancybox.close();
                $(this).hide();
            });
            uc.css('cursor', 'pointer');

            var tt = $('#topbar-title');
            pnlBtn.click(function () {
                uc.show();
                $.fancybox({
                    content: pnlMap,
                    type: 'html',
                    autoSize: false,
                    width: '100%',
                    height: '100%',
                    autoResize: true,
                    padding: 0,
                    margin: [40, 0, 0, 0],
                    scrolling: 'no',
                    helpers: {
                        overlay: {
                            css: {
                                'overflow': 'hidden',
                                'background-color': '#d7edfb'
                            }
                        }
                    },
                    afterLoad: function () {
                        var z = $('.fancybox-overlay').css('z-index');
                        $('#topbar').css('z-index', z + 1);

                        tt.css('cursor', 'pointer');
                        tt.click(function () {
                            $.fancybox.close();
                        });
                    },
                    beforeClose: function () {
                        $('#topbar').css('z-index', '');
                        uc.hide();
                        tt.css('cursor', '');
                        tt.off('click');
                    }
                    //closeClick: true
                });
            });
        }
    }

    return {
        init: init,
        setLocationGenerator: function(f){
            locationGenerator = f;
        }
    }
});
