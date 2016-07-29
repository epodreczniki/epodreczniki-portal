define(['jquery', 'endpoint_tools'], function($, endpoint_tools){

    return {
        connectEmbedUrlGenerator: function(wnd, frame){
            var f = function (e) {
                var response = {
                    'getVideoEmbedUrl': 'videoEmbedUrl',
                    'getAudioEmbedUrl': 'audioEmbedUrl'
                };

                if (e.originalEvent.data.msg == 'getVideoEmbedUrl' ||
                    e.originalEvent.data.msg == 'getAudioEmbedUrl') {

                    var womiId = e.originalEvent.data.womiId;
                    var womiVersion = e.originalEvent.data.womiVersion;
                    if(e.originalEvent.source == frame) {
                        e.originalEvent.source.postMessage({
                            msg: response[e.originalEvent.data.msg],
                            url: endpoint_tools.replaceUrlArgs($('base').data('womi-embed-pattern'), {
                                womi_id: womiId,
                                version: womiVersion
                            }),
                            womiId: womiId,
                            womiVersion: womiVersion,
                            key: (e.originalEvent.data.key ? e.originalEvent.data.key : null)
                        }, '*');
                    }
                }
            };

            $(wnd).on('message', f);

            return function(){
                //disconnect
                $(wnd).off('message', f);
            }
        }
    }
});
