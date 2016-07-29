define(['jquery', '../../Component', 'underscore', 'libs/literallycanvas'], function ($, Component, _, ltcanvas) {

    //TODO: improve code !!!!
    return Component.extend({
        elementSelector: '#showHideWomi',
        load: function () {
            this._on = false;
            this.readerContent = $('.reader-content');
            this.canvas = $('#canvas');
            this.lc = $('<div class="position-literally">');
            this.canvas.after(this.lc);

            this.lc.hide();
            this.$el.text('Rysuj');

            this.$el.click(_.bind(function () {
                this._on = !this._on;
                if (this._on) {
                    this.renderLC();
                } else {
                    this.dispose();
                }
            }, this));

            this.listenTo(this._layout, 'windowResize', function () {
                this.lcResize();
            });
        },

        closeBtn: function () {
            this.closing = $('<div class="close-lc lc-clear toolbar-button fat-button">Zamknij</div>');
            this.closing.click(_.bind(function () {
                this._on = false;
                this.dispose();
            }, this));
            return this.closing;
        },

        lcResize: function () {
            this.lc.css({
                width: $(window).width(),
                height: $(window).height()
            });
        },

        dispose: function () {
            this.lc.html('');
            this.lc.hide();
            this.readerContent.show();
            this.trigger('navShowDisplay');
        },

        renderLC: function () {
            this.readerContent.hide();
            this.lc.show();
            this.lcResize();
//                    var backgroundImage = new Image();
//                    backgroundImage.crossOrigin = "anonymous";
//                    backgroundImage.src = canvas.get(0).toDataURL();
//                    var backgroundShape = ltcanvas.createShape(
//                    'Image', {x: 0, y: 0, image: backgroundImage});
            /*, backgroundShapes: [backgroundShape]*/
            this.lc.literallycanvas({imageURLPrefix: '{{ STATIC_URL }}reader/img/literallycanvas'});
            this.lc.find('.lc-picker-contents').append(this.closeBtn());
            this.lc.find('.lc-zoom-in').hide();
            this.lc.find('.lc-zoom-out').hide();
            this.lc.find('div[title="Eyedropper"]').hide();
            this.lc.find('.color-well-label').first().hide();
            this.trigger('navHideDisplay');
        }
    });

});