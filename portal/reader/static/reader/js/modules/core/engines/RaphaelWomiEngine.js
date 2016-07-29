//>startExclusion
{% load engines %}
//>endExclusion

define(['require', 'jquery', 'bowser', './PureHTMLEngine'], function (require, $, bowser, PureHTMLEngine) {
    return PureHTMLEngine.extend({
        scriptSrc: "{% autoescape off %}{{ STATIC_URL }}{{ EXTERNAL_ENGINES.raphael_womi.url_template }}{% endautoescape %}",

        load: function () {

            var src = this.source;
            var base = src.replace(src.substr(src.lastIndexOf('/') + 1), '');
            base = base.replace('/', '');

            this.savedSrc = this.savedSrc || this.source;
            var _this = this;

            if (!this._playScreenClicked) {
                require(['require', 'text!' + src], function (r, config) {
                    config = JSON.parse(config);

                    var newSrc = _this.scriptSrc + '?url=' + $('base').attr('href') + base + config.file;

                    if (config.style != undefined)
                        newSrc = newSrc + '&style_url=' + $('base').attr('href') + base + config.style;

                    _this.source = newSrc;

                    PureHTMLEngine.prototype.load.call(_this);
                });
            }
            else {
                PureHTMLEngine.prototype.load.call(this);
            }
        }

    });
});