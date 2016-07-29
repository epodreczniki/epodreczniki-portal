//>startExclusion
{% load engines %}
//>endExclusion

define(['require', 'jquery', 'bowser', './PureHTMLEngine'], function (require, $, bowser, PureHTMLEngine) {

    return PureHTMLEngine.extend({
        scriptSrc: "{% autoescape off %}{{ STATIC_URL }}{{ EXTERNAL_ENGINES.svg_editor.url_template }}{% endautoescape %}",

        _calcDimensions: function () {
            return {
                width: $(this.destination).width(),
                height: (this.fsMode ? $(window).height() : this.maxPercentageHeight * $(window).height())
            };
        },

        load: function () {
            this._playScreenClicked = true;
            this.savedSrc = this.savedSrc || this.source;
            this.source = this.scriptSrc + '?url=' + $('base').attr('href') + this.savedSrc;
            PureHTMLEngine.prototype.load.call(this);
        }
    });
});