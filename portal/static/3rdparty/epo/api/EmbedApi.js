define('embed.api', ['jquery'], function ($) {
    return {
        getEmbedUrl: function (type, womiId, womiVersion, callback) {
            var key = '' + womiId + '_' + womiVersion + '_' + Date.now() + '_' + Math.random();
            var evt = function (event) {
                if (event.originalEvent.data.key == key) {
                    callback(event.originalEvent.data);
                    $(window).off('message', evt);
                }
            };
            $(window).on('message', evt);

            window.parent.postMessage({
                msg: 'get' + type + 'EmbedUrl',
                womiId: womiId,
                womiVersion: womiVersion,
                key: key
            }, '*');
        }
    }
});
