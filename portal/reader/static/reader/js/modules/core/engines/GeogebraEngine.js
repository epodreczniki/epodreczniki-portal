define(['require', 'jquery', 'bowser', 'backbone', 'underscore', './ScalingDivMixin', './EngineInterface', 'modules/api/Utils'], function (require, $, bowser, Backbone, _, ScalingDivMixin, EngineInterface, apiUtils) {
    var GeogebraEngine = Backbone.View.extend({});
    _.extend(GeogebraEngine.prototype, EngineInterface.prototype, ScalingDivMixin, {
        scriptSrc: "{% autoescape off %}{{ STATIC_URL }}{{ EXTERNAL_ENGINES.geogebra.url_template }}{% endautoescape %}",
        scriptSrc3d: "{% autoescape off %}{{ STATIC_URL }}{{ EXTERNAL_ENGINES.geogebra.url_template2 }}{% endautoescape %}",

        VERSION_MAP: {
            '4.2.51.0': '4.3.81.0',//'4.2.53.0',
            '4.2': '4.2.60.0',
            '4.3': '4.3.81.0',
            '4.4': '4.4.37.0',
            '5.0': '5.0.142.0',
            'default': '4.4.37.0'
        },

        verRegex: /(\d+.\d+).\d+.\d+/,

        versionResolver: function (ver) {
            if (ver) {
                if(this.VERSION_MAP[ver]){
                    return this.VERSION_MAP[ver];
                }
                var splitVersion = ver.match(this.verRegex)[1];
                var resolver = this.VERSION_MAP[splitVersion];
                if (resolver) {
                    return resolver;
                } else {
                    return this.VERSION_MAP['default']
                }
            } else {
                return this.VERSION_MAP['default']
            }
        },

        load: function () {
            var dimensions = this.resizeArticleToContainer(this.destination);
            var ver = $(this.destination).data('version');

            this._prependUnderlay(false);

            if (!this.fsMode) {
                if (this._initPlayScreen(dimensions)) {
                    this.on('resize', this.debouncedResizeHandler());
                    return;
                } else {
                    this.off('resize', this.debouncedResizeHandler());
                }
            }

            var article = $(this.source);

            article.attr("data-param-enableRightClick", "false");

            var script = document.createElement('script');

            var resolvedVer = this.versionResolver(ver);
            if(ver[0] >= 5 && article.attr('data-uses-3d') === 'true'){
                script.src = this.scriptSrc3d.replace('{ver}', resolvedVer);
                //article.attr('data-param-showtoolbar', 'true');
                //article.attr('data-param-showmenubar', 'true');
                //article.attr('data-param-showdockbar', 'true');
            }else {
                script.src = this.scriptSrc.replace('{ver}', resolvedVer);
            }

            var _this = this;

            this.createIframe(this.destination, dimensions, function (iframe) {
                var cloned = article.clone();
                cloned.attr('data-param-width', cloned.attr('data-param-width') - 3);
                cloned.attr('data-param-height', cloned.attr('data-param-height') - 3);
                iframe.contents().find('body').append(cloned);
                iframe[0].contentWindow.document.body.appendChild(script);
            }, function (iframe) {
                _this.debounceBody = function (width, height) {
                    var d = _this.resizeArticleToContainer(_this.destination);
                    iframe.parent().css({
                        width: d.desiredWidth,
                        height: d.desiredHeight
                    });
                    iframe.css('transform', 'scale(' + (d.scale) + ')');
                    iframe.css('transform-origin', '0 0');
                };
                iframe[0].scrolling = 'no';
            });

            this.on('resize', this.debouncedResizeHandler());
        },

        dispose: function () {
            this._prependUnderlay(true);
            $(this.destination).children().remove();
            this._playScreenClicked = false;
            this.off('resize', this.debouncedResizeHandler());

        },

        resizeArticleToContainer: function (container) {
            var article = $(this.source);
            var width = parseFloat($(container).data('width')) / 100.0;
            var w = (this.fsMode ? $(window).width() : (width * $(container).width()));
            var ratio = w / article.attr('data-param-width');

            var desiredWidth = w;
            var desiredHeight = article.attr('data-param-height') * ratio;

            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (this.fsMode) {
                maxHeight = $(window).height();
            }

            if (desiredHeight > maxHeight) {
                var scale = maxHeight / desiredHeight;
                desiredWidth *= scale;
                desiredHeight *= scale;
            }

            desiredWidth = Math.floor(desiredWidth);
            desiredHeight = Math.floor(desiredHeight);

            // XXX Geogebra seems to use some additional pixels to draw its border so account for that
            //article.attr('data-param-width', article.attr('data-param-width') - 3);
            //article.attr('data-param-height', desiredHeight - 3);

            return {
                desiredWidth: desiredWidth,
                desiredHeight: desiredHeight,
                width: article.attr('data-param-width') * 1,
                height: article.attr('data-param-height') * 1,
                scale: Math.min(desiredWidth / article.attr('data-param-width'), desiredHeight / article.attr('data-param-height'))
            };
        },

        getSize: function () {
            var article = $(this.source);
            var dimensions = this.resizeArticleToContainer(this.destination);

            //return {width: article.attr('data-param-width'), height: article.attr('data-param-height')}
            return {width: dimensions.desiredWidth, height: dimensions.desiredHeight}
        },
        license: function () {
            return {
                type: 'source',
                src: apiUtils.buildUrl($('base').data('womi-url-pattern'), {womi_id: this._parentOptions.womiId, version: 1, path: 'metadata.json'})
            }
        }

    });

    return GeogebraEngine;
});