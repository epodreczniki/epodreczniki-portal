define(['jquery', 'underscore', 'modules/core/womi/WOMIGalleryContainer'//, './gallery/WOMIContainer'
], function ($, _, WOMIGalleryContainer) {

    function isIn(val, setArr) {
        return _.indexOf(setArr, val) > -1;
    }

    return WOMIGalleryContainer.extend({

        initialize: function (options) {
            WOMIGalleryContainer.prototype.initialize.call(this, options);
            //this.setWomiContainer(WOMIContainer);
        },
        renderA: function(){
            WOMIGalleryContainer.prototype.renderA.call(this);
            this.stage.after(this.titlePlaceholder);
        },
        containerHeight: function () {

            if (this.maximized) {
                return ($(window).height() - 115 - (this._womi[this.idx].hasButtons() ? 35 : 0));// * this.maxHeightStage;
            }

            var _maxHeight = 0.65;

            return _maxHeight * $(window).height();
        },
        setTitleAndContent: function (womi, titlePlaceholder, where, onlyContent) {

            var tc = womi.getTitleAndContent();
            //tc.content = "Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w&nbsp;przemyśle&nbsp;poligraficznym. <br>Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym.";
            titlePlaceholder = titlePlaceholder || this.titlePlaceholder;
            titlePlaceholder.html('');
            where = where || ['all', 'hide-fullscreen'];
            if (isIn(this.galleryParams.titles, where) && tc.partTitle && !onlyContent) {
                titlePlaceholder.text(tc.partTitle);
            }
            if (isIn(this.galleryParams.contents, where) && tc.content) {
                titlePlaceholder.parent().find('.caption').remove();
                titlePlaceholder.after($('<div>', {class: 'caption', html: _.unescape(tc.content)}));
            }
        }

        /*,

        createThumbs: function (prevOrNext) {
            var _this = this;
            var pikaThumbs = $('<ul>', {'class': 'jcarousel-skin-pika pika-thumbs'});
            var thumbsContainer = $('<div>', {'class': 'thumbs-container'});
            this.thumbsContainer = thumbsContainer;
            this.gallery.append(thumbsContainer);
            thumbsContainer.append(pikaThumbs);
            var ul = pikaThumbs;
            this.on('rescaleThumbs', function () {
                ul.find('img').css({ 'max-width': '350px', 'max-height': (_this.containerHeight() * _this.maxHeightThumbs) + 'px' });
            });

            _.each(this._womi, function (w, index) {
                var alt = w.selected.object.altText();
                var item = $(_.template(_this.miniatureTemplate, {imgSrc: w.getMiniature(), title: w.selected.options.title, alt: alt || w.selected.options.title}));
                ul.append(item);
                item.click(function () {
                    prevOrNext(index - _this.idx);
                });
            });
            this.trigger('rescaleThumbs');

             var thumbs = thumbsContainer.clone();

            this.on('scrollToMiniature', function (data) {
                var diff = data.curIdx - data.prevIdx;
                var curMiniature = $(ul.find('li')[data.curIdx]);
                ul.find('li').removeClass('active');
                thumbs.find('li').removeClass('active');
                if (data.curIdx != 0) {
                    thumbsContainer.animate({ scrollLeft: thumbsContainer.scrollLeft() + (curMiniature.width() * diff)});
                } else {
                    thumbsContainer.animate({ scrollLeft: 0});
                }
                $(ul.find('li')[data.curIdx]).addClass('active');
                $(thumbs.find('li')[data.curIdx]).addClass('active');

            });

            this._handleThumbs();


            var lisT = thumbsContainer.find('.pika-thumbs li');
            thumbs.find('.pika-thumbs li').each(function (index) {
                var t = $(this);
                var im = $(lisT[index]).find('div').find('img');
                t.find('div').hide();
                var clk = im.click;
                var d = $('<div class="thumb-dot-icon"></div>');
                t.append(d);
                d.click(function () {
                    im.click();
                });
            });

            thumbs.show();
            thumbs.removeClass('thumbs-container');
            thumbs.addClass('uwr-thumbs-container');
            thumbsContainer.after(thumbs);
//                if (galleryTitle) {
//                    thumbs.before(galleryTitle);
//                }


        }*/
    });
});