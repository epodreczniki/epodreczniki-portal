define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {

    function SwiffyEngineScriptUrl(version) {
        var enginesPattern = '{% autoescape off %}{{ EXTERNAL_ENGINES.swiffypattern.url_template }}{% endautoescape %}';

        return '{{ STATIC_URL }}' + enginesPattern.replace('{ver}', version);
    }

    function getVersion(data){
        var pattern = /SwiffyEngineScriptUrl\('([0-9].[0-9]?)'\)/;
        var match = data.match(pattern);
        if(match && match[1]){
            return match[1];
        }
        return '6.0';
    }

    return EngineInterface.extend({

        load: function () {
            this.internalWindow = null;
            var srcUrl = this.source;
            var dimensions = {
                width: $(this.destination).width(),
                height: $(this.destination).width() * this._opts.heightRatio
            };

            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (this.fsMode) {
                maxHeight = $(window).height();
            }

            if (dimensions.height > maxHeight) {
                var scale = maxHeight / dimensions.height;
                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            this._prependUnderlay(false);
            if (!this.fsMode) {
                if (this._initPlayScreen(dimensions)) {
                    this.on('resize', this.debouncedResizeHandler());
                    return;
                } else {
                    this.off('resize', this.debouncedResizeHandler());
                }
            }
            var _this = this;
            if (navigator.userAgent.indexOf("MSIE") != -1) {

                $.get(srcUrl, function (data) {
                    _this.createIframe(_this.destination, dimensions, function (iframe) {
                        var scriptSrc = SwiffyEngineScriptUrl(getVersion(data));
                        var scriptSrcPattern = /var scriptSrc = .*;/;
                        var documentDomainPattern = /document\.domain .*;/;
                        var newData = data.replace(scriptSrcPattern, 'var scriptSrc = \"' + scriptSrc + '\";');
                        newData = newData.replace(documentDomainPattern, '');
                        iframe[0].contentWindow.document.write(newData);
                        _this.internalWindow = iframe[0].contentWindow;
                        iframe.contents().find('#swiffycontainer').css('width', dimensions.width + "px").css('height', dimensions.height + "px");
                    }, function (iframe) {
                        //pass
                    });

                    _this.on('resize', _this.debouncedResizeHandler());
                }, null, 'html');
            } else {
                this.createIframe(this.destination, dimensions, function (iframe) {
                    iframe.contents().find('#swiffycontainer').css('width', dimensions.width + "px").css('height', dimensions.height + "px");
                    _this.internalWindow = iframe[0].contentWindow;
                }, function (iframe) {
                    iframe[0].src = srcUrl;
                });

                this.on('resize', this.debouncedResizeHandler());
            }

        },

        dispose: function () {
            this._prependUnderlay(true);
            $(this.destination).children().remove();
            this._playScreenClicked = false;
            this.internalWindow = null;
            this.off('resize', this.debouncedResizeHandler());
        },

        getSize: function () {
            var hRatio = this._opts.heightRatio;

            return {width: 900, height: 900 * hRatio}
        },

        getButtons: function () {
            var _this = this;
            return {
                stop: function () {
                    _this.dispose();
                    _this.load();
                },
                pause: function () {
                    if (_this.internalWindow != null) {
                        if (this.paused) {
                            _this.internalWindow.stageObj.start();
                            this.paused = false;
                        } else {
                            _this.internalWindow.stageObj.stop();
                            this.paused = true;
                        }
                    } else {
                        _this._playScreenClicked = true;
                        _this.load();
                    }

                }
            }
        }
    });
});