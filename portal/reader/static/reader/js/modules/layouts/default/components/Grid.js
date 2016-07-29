define(['jquery', '../../Component', 'underscore', 'modules/core/Logger', 'modules/utils/ReaderUtils', './includes/foldable', './includes/content-expanding'], function ($, Component, _, Logger, Utils, Foldable, ContentExpanding) {

    var HIGHLIGHT_TIME = 2500;

    var topOffset = 50;

    var readerDefinition = $('#reader-definition');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };

    function scrollOffset() {
        setTimeout(function () {
            window.scrollTo(0, $(window).scrollTop() - topOffset);
        }, 500);
    }


    return Component.extend({
        name: 'Grid',
        elementSelector: '[data-component="grid"]',

        events: {
            'click .radio-simulator': 'radioButtonSelect'
        },

        postInitialize: function (options) {
            this._moduleContent = this.$el.find('[data-component="module-content"]');
            Utils.setMainContentPlaceholder(this._moduleContent);
            window.onhashchange = function () {
                scrollOffset();
            };
        },

        load: function () {
            var _this = this;
            _this.moduleLoadInProgress(true);

            this.listenTo(this._layout, 'moduleLoaded', function (state) {
                _this.qrCodeProcess(state.href);

                _this._moduleContent.children().first().children('.section').css('clear', 'both');
                Foldable.addFoldable();
                ContentExpanding.addSectionExpanding();

                ContentExpanding.addTocExpanding();
                _this.moduleLoadInProgress(false);


            });

            this.listenTo(this._layout, 'cleanWorkspace', function () {
                _this.cleanFunctions();
                _this.moduleLoadInProgress(true);


            });

            if (window.location.href.indexOf('#') >= 0) {
                scrollOffset();
            }

            this.$el.click(function(){
               _this.trigger('gridClicked');
            });

//            $('body').dblclick(function(event){
//                event.preventDefault();
//                if(document.selection && document.selection.empty) {
//                    document.selection.empty();
//                } else if(window.getSelection) {
//                    var sel = window.getSelection();
//                    sel.removeAllRanges();
//                }
//                return false;
//            });

            this.listenTo(this._layout, 'getModuleContent', _.bind(function(){
                this.trigger('moduleContentTarget', {target: this.contentPlaceholder()});
            }, this));

            this.checkHighContrastMode();

            _this.moduleLoadInProgress(false);

        },

        moduleLoadInProgress: function ( hide ) {
            if (hide) {
                $("div.grid").css('visibility','hidden');
            } else {
                $("div.grid").css('visibility','visible');
            }
        },

        checkHighContrastMode: function () {

            //console.log("Checking for high-contrast mode...");
            var objDiv, strColor;
            objDiv = document.createElement('div');
            objDiv.style.color = 'rgb(31, 41, 59)';
            document.body.appendChild(objDiv);
            strColor = document.defaultView ? document.defaultView.getComputedStyle(objDiv, null).color : objDiv.currentStyle.color;
            strColor = strColor.replace(/ /g, '');
            document.body.removeChild(objDiv);
            if (strColor !== 'rgb(31,41,59)') {
                $('body').addClass('high-contrast');
                console.log("High-contrast mode detected.");
            } else {
                console.log("Standard-contrast mode detected.");
            }

        },

        radioButtonSelect: function (ev) {
            var checked = ev.target;

            $(checked).closest('.question-set').find('.radio-simulator').removeClass('active');
            $(checked).closest('.question-set').find('.radio-simulator').attr('aria-checked', 'false');
            //$(checked).closest('.question-set').find('.radio-simulator').attr('tabindex', '-1');

            $(checked).addClass('active');
            $(checked).attr('aria-checked', 'true');
            //$(checked).attr('tabindex', '0');

            var exercise = $(checked).closest('.exercise');
            var selected = '';

            _.each($(exercise).find("input[type='radio']"), function (radio){
                if($(radio).attr('id') == $(checked).attr('id')){
                selected = radio;
                }
            });

            $(selected).attr('checked', true);
        },

        contentPlaceholder: function () {
            return this._moduleContent;
        },


        qrCodeProcess: function (href) {
            function getElementWithId(object) {
                var element = $(object);

                while (!element.attr('id')) {
                    element = element.parent();
                }

                return element;
            }

            function generateAnchorsAndQRCode(oldHref) {
                var href = oldHref;
                var index = href.indexOf('#');

                index = index != -1 ? index : href.length;
                href = href.substr(0, index);

                var headers = $('#module-content').find('.section-header');

                var showQRCode = function (event) {

                    var element = getElementWithId(event.target);
                    var div = $('<div/>', {
                        'class': 'qr-code',
                        style: 'position: fixed; top: 50%; left:50%; margin-top: -130px; margin-left: -130px;'
                    });
                    div.qrcode(href + '#' + element.attr('id'));
                    $.fancybox.open({
                        content: div,
                        wrapCSS: 'fancybox-modal fancybox-modal-qr',
                        closeClick: true,
                        afterShow: function () {
                        	 $('div.fancybox-overlay').addClass('qrcode-background');
                             $('div.fancybox-skin').css('background', 'none');
                             var fancyBoxClose = $('a.fancybox-close');
                             fancyBoxClose.addClass('qrcode-close-image');
                             fancyBoxClose.addClass('hastip');
                             fancyBoxClose.attr('title', 'Zamknij');
                             fancyBoxClose.tooltipsy({
                                 alignTo: 'element',
                                 offset: [-1, 1]
                             });
                        },
                        afterClose: function () {
                            $('div.tooltipsy').remove();
                        },
                        helpers: {
                            overlay: {
                                closeClick: true,
                                locked: false,
                                css: {
                                   // 'background': 'rgba(255, 255, 255, 0.6)'
                                }
                            }
                        }
                    });
                    
                };

                headers.each(function (index, element) {
                    var elemen = getElementWithId(element);
                    var container = $('<div/>', {
                        class: 'anchor-container'
                    });
                    var a = $('<a/>', {
                        'href': href + '#' + elemen.attr('id'),
                        'html': '<i class="icon-anchor"</i>',
                        'class': 'anchor',
                        click: function () {
                            elemen.effect('highlight', {}, HIGHLIGHT_TIME);
                        }
                    });

                    container.append(a);
                    elemen.addClass('anchor-padding');

                    a.click(function(e){
                    	e.preventDefault();
                    });

                    var qra = $('<a/>', {
                    	href: '#',
                    	'html': '<i class="icon-qrcode"</i>',
                    	'class': 'qr-anchor',
                    	'click': function (event) {
                    		showQRCode(event);
                    		return false;
                    	}
                    });

                    container.append(qra);

                    $(element).append(container);
                });

//                function mouseTriger() {
//                    $(this).find('.anchor-container').fadeToggle();
//                }
//
                $('.section-header').hoverIntent({
                    over: function(){
                  	  $(this).find('.anchor-container').css('opacity', '0.9');
                    },
                    out: function(){
                  	  $(this).find('.anchor-container').css('opacity', '0.3');
                    }
                });
            }

            generateAnchorsAndQRCode(href);
        },

        cleanFunctions: function () {
            $.fancybox.close(true);

            $('.hastip').each(function () {
                try {
                    $(module).data('tooltipsy').destroy();
                } catch (err) {
                }
            });
        }

    })
});
