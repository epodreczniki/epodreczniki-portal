define(['jquery'], function ($) {
return {
        plusWH: 3,
        iframeResizeCallback: function (width, height, iframe) {
            console.log('iframe callback called', width, height, iframe);
        },
        contentsAdjust: function (iframe) {
            iframe.contents().find('body').css({
                margin: 0,
                padding: 0,
                overflow: 'hidden'
            });
        },
        postIframeLoad: function(iframe){

        },
        addMessageEvent: false,
        createIframe: function (container, dimensions, onloadCallback, preLoadCallback) {

            var iframe = $('<iframe frameborder="0">').css({
                margin: 0,
                padding: 0,
                border: 'none',
                width: dimensions.width + this.plusWH,
                height: dimensions.height + this.plusWH,
                overflow: 'hidden'
            });

            var _this = this;
            if (this.addMessageEvent) {
                $(window).on('message', function (e) {
                    if (iframe[0].contentWindow == e.originalEvent.source && e.originalEvent.data.msg == 'edgeResize') {
                        _this.iframeResizeCallback(e.originalEvent.data.width, e.originalEvent.data.height, iframe);
                    }
                });
            }
            if (preLoadCallback) {
                preLoadCallback(iframe);
            }
            iframe.addClass('proper-element');

            iframe.load(function () {
                _this.contentsAdjust(iframe);
                onloadCallback(iframe);
                iframe.css('transform', 'scale(' + (dimensions.scale) + ')');
                iframe.css('transform-origin', '0 0');
                iframe.css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                });
                _this.postIframeLoad(iframe);
            });
            var scalingDiv = $('<div>');
            scalingDiv.width(dimensions.desiredWidth).height(dimensions.desiredHeight);
            scalingDiv.css('margin', '0 auto');
            scalingDiv.css('overflow', 'hidden');
            $(container).append(scalingDiv);
            scalingDiv.append(iframe);
            scalingDiv.css({
                position: 'relative'
            });
        }
    };
});