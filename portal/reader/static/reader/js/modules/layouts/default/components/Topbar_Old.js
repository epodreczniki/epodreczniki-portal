define(['jquery',
    'backbone',
    '../../Component',
    'text!../templates/PinsBar.html',
    'text!../templates/PinsBarPanel.html',
    'text!../templates/ToolsBar.html',
    'underscore',
    'domReady',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/core/WomiManager',
    'layout',
    'search_box',
    'portal_instance'], function ($, Backbone, Component, PinsBar, PinsBarPanel, ToolsBar, _, domReady, Logger, Utils, womi, layout, search_box, portal_instance) {

    var pinBarExists = false;
    var PinsPanelSlide = Backbone.View.extend({
        initialize: function (options) {
            this.element = options.element;
            this.setElement($('<ul>', {'class': 'pins-dropdown-div'}));
            this.slides = options.slides;
        },

        hide: function () {
            this.$el.hide();
        },

        render: function () {
            this.$el.html('');
            var parent = this.$el.closest('.pinbar-dropdown');
            var _this = this;
            var found = false;
            _.each(womi.objects, function (o) {
                if (!(o.selected)) {
                    return
                }
                var cnt = (o.selected).object;
                if (cnt.containerClass == (_this.element.validClass) && o.selected.options.roles.context) {
                    var title = o.selected.options.title || cnt.data('alt');
                    var imgUrl = o.getMiniature();
                    var cls = '';
                    if (imgUrl == '') {
                        imgUrl = null;
                        cls = _this.element.validClass;
                    }
                    var item = $(_.template(PinsBarPanel, {title: title, imgUrl: imgUrl, thumbClass: cls}));
                    item.click(function () {
                        _this._clickControl(o);
                    });
                    _this.$el.append(item);
                    found = true;
                }
            });

            _.each(womi.objects, function (o) {
                if(o._womi !== undefined){
                    _.each(o._womi, function(womi){
                        var galleryTitle = "Galeria";
                        if(o._title[0]){
                            galleryTitle = $(o._title[0]).text();
                        }
                        var womiTitle = galleryTitle +" - " + womi.getTitleAndContent().title;
                        var imgUrl = womi.getMiniature();
                        var cls = 'image-container';
                        var item = $(_.template(PinsBarPanel, {title: womiTitle, imgUrl: imgUrl, thumbClass: cls}));
                        item.click(function () {
                            _this._clickControl(womi);
                        });
                        _this.$el.append(item);
                        found = true;

                    })
                }
            });

            if (!found) {
                var item = $(_.template(PinsBarPanel, {title: 'brak elementów do wyświetlenia', imgUrl: null, thumbClass: 'empty' }));
                _this.$el.append(item);
            }
            _this.$el.css({
                top: parent.position().top + parent.height()
            });
            return this.$el;
        },

        _clickControl: function(womi){
            _.each(this.slides, function (slide) {
                slide.hide();
            });
            $('.pinbar-dropdown').hide("slide", {direction: 'up'});
            if (!layout.fullScreenMode()) {
                $('.pins-button').show();
            } else {
                $('.pins-button').show();
                $('.pins-button').addClass('pins-button-background');
                $('.pins-button').removeClass('close-button-background');
            }
            $('.search').show();
            $('.settings').show();
            $('.table-of-contents').show();
            pinBarExists = false;
            if (womi.contextCallback()) {
                //o.contextCallback();
            } else if (womi._fullscreenMenuItem()) {
                womi._fullscreenMenuItem().callback();
            }
            return false;
        }
    });


    return Component.extend({
        name: 'Topbar',
        elementSelector: '[data-component="topbar"]',

        events: {
            'click .font_size_btn': 'fontSizeControl'
        },

        postInitialize: function (options) {

            this.fontSize = 100;

        },

        load: function () {
            var _this = this;

            this.pinsSwitch = function () {
                if (!pinBarExists) {
                    _this.trigger('showPins');
                    $('.pinbar-dropdown').show("slide", {direction: 'up'});
                    if (!layout.fullScreenMode()) {
                        $('.pins-button').hide();
                    } else {
                        $('.pins-button').addClass('close-button-background');
                        $('.pins-button').removeClass('pins-button-background');
                    }
                    $('.search').hide();
                    $('.settings').hide();
                    $('.table-of-contents').hide();
                    pinBarExists = true;
                } else {
                    _this.trigger('hidePins');
                    $('.pinbar-dropdown').hide("slide", {direction: 'up'});
                    if (!layout.fullScreenMode()) {
                        $('.pins-button').show();
                    } else {
                        $('.pins-button').show();
                        $('.pins-button').addClass('pins-button-background');
                        $('.pins-button').removeClass('close-button-background');
                    }
                    $('.search').show();
                    $('.settings').show();
                    $('.table-of-contents').show();
                    pinBarExists = false;
                }
                $('.pins-button').data('tooltipsy') && $('.pins-button').data('tooltipsy').hide()
            };

            var toolsBarExists = false;
            this.toolbarSwitch = function () {
                if (!toolsBarExists) {
                    $('.tools-dropdown').show("slide", {direction: 'up'});
                    if (!layout.fullScreenMode()) {
                        $('.tools-menu-button').hide();
                    } else {
                        $('.tools-menu-button').removeClass('tools-button-background');
                        $('.tools-menu-button').addClass('close-button-background');
                    }
                    $('.search').hide();
                    $('.pins').hide();
                    $('.table-of-contents').hide();
                    toolsBarExists = true;
                } else {
                    $('.tools-dropdown').hide("slide", {direction: 'up'});
                    if (!layout.fullScreenMode()) {
                        $('.tools-menu-button').show();
                    } else {
                        $('.tools-menu-button').removeClass('close-button-background');
                        $('.tools-menu-button').addClass('tools-button-background');
                        $('.tools-menu-button').show();
                    }
                    $('.search').show();
                    $('.pins').show();
                    $('.table-of-contents').show();
                    toolsBarExists = false;
                }
            };

            var searchExists = false;
            this.searchSwitch = function () {
                if (!searchExists) {
                    $('.search-dropdown').show("slide", {direction: 'up'});
                    $('.search-dropdown').show();
                    if (!layout.fullScreenMode()) {
                        $('#search-button').hide();
                    } else {
                        $('#search-button').addClass('close-button-background');
                        $('#search-button').removeClass('search-button-background');
                        $('ul.search').css('margin-right', '12px');
                    }
                    $('.settings').hide();
                    $('.pins').hide();
                    $('.table-of-contents').hide();
                    searchExists = true;

                } else {
                    $('.search-dropdown').hide("slide", {direction: 'up'});
                    if (!layout.fullScreenMode()) {
                        $('#search-button').show();
                    } else {
                        $('#search-button').show();
                        $('ul.search').css('margin-right', '');
                        $('#search-button').addClass('search-button-background');
                        $('#search-button').removeClass('close-button-background');
                    }

                    $('.settings').show();
                    $('.pins').show();
                    $('.table-of-contents').show();
                    searchExists = false;
                }
                $('button.search-button').data('tooltipsy') && $('button.search-button').data('tooltipsy').hide();
            };
            var tochidden = true;

            this.tocSwitch = function (e) {

                $('div.toc-dropdown').toggleClass('shown', 400)

                tochidden = !tochidden;

                $('#toc-details-button').toggle();

                $('#home_link').toggle();

                if (!layout.fullScreenMode()) {
                    $('.topbar-tools').toggle();
                }
                
                if($('#toc-details-button').is(":visible")){
                    $('#toc-button').attr('tabindex', '1');
                    $('#toc-details-button').attr('tabindex', '2');
                    $('#home_link').attr('tabindex', '3');
                    $('#search-button').attr('tabindex', '4');
                    $('button.pins-button').attr('tabindex', '5');
                    $('button.tools-menu-button').attr('tabindex', '6');
                    $('button.left').attr('tabindex', '7');
                    $('button.right').attr('tabindex', '8');
                }else{
                    $('#toc-button').attr('tabindex', '1');
                    $('#toc-details-button').attr('tabindex', '-1');
                    $('#home_link').attr('tabindex', '-1');
                    $('#search-button').attr('tabindex', '2');
                    $('button.pins-button').attr('tabindex', '3');
                    $('button.tools-menu-button').attr('tabindex', '4');
                    $('button.left').attr('tabindex', '5');
                    $('button.right').attr('tabindex', '6');
                }
            };

            this.listenTo(this._layout, 'gridClicked', function () {
                if (pinBarExists) {
                    _this.pinsSwitch();
                }
                if (toolsBarExists) {
                    _this.toolbarSwitch();
                }
                if (searchExists) {
                    _this.searchSwitch();
                }
                if (!tochidden) {
                    _this.tocSwitch();
                }
            });

            $('*:not(#toc-button, #toggle-index, .module-a, .tools-menu-button, .pins-button)').click(function(ev){
                if(ev.target == this){
                    _this.trigger('gridClicked');
                }
            });

            _this.handleButtonsEvents();
        },

        fontSizeControl: function (ev) {

            ev.preventDefault();

            function hideTips(el){
                setTimeout(function(){
                    el.data('tooltipsy') && el.data('tooltipsy').hide();
                }, 400);
            }

            var action = $(ev.target).attr('id');

            var _this = this;

            var handler = {
                font_size_increase: function () {
                    if (_this.fontSize < 175) _this.fontSize += 25
                    _this.fontSize == 175 ? $('#font_size_increase').attr('disabled', true) : $('#font_size_increase').attr('disabled', false)
                    $('#font_size_decrease').attr('disabled', false);
                    hideTips($('#font_size_increase'));
                },
                font_size_decrease: function () {
                    if (_this.fontSize > 100) _this.fontSize -= 25
                    if (_this.fontSize == 100) $('#font_size_decrease').attr('disabled', true)
                    $('#font_size_increase').attr('disabled', false);
                    hideTips($('#font_size_decrease'));
                }
            };

            handler[action]();

            $('.reader-content').css('font-size', this.fontSize + '%');

            return false;

        },

        handleButtonsEvents: function () {
            var _this = this;

            var tocButtons = $('div.table-of-contents-buttons').children();
            _.each(tocButtons, function (el) {
                $(el).addClass('hastip');
                if (el.id == 'toc-button') {
                    $(el).attr('title', 'Spis&nbsptreści');
                    $(el).tooltipsy({
                        offset: [50, 5]
                    });
                } else if (el.id == 'toc-details-button') {
                    $(el).attr('title', 'Szczegóły');
                    $(el).tooltipsy({
                        offset: [1, 1]
                    });
                } else {
                    $(el).attr('title', 'Strona&nbspgłówna');
                    $(el).tooltipsy({
                        offset: [50, 5]
                    });
                }

            });

            $('#toc-button, #toggle-index').click(function () {
                _this.tocSwitch();
                $('.hastip').data('tooltipsy').hide();
                $('.hastip').data('tooltipsy') && $('.hastip').data('tooltipsy').hide()
            });

            var pinsBar = $(_.template(PinsBar, {pin: 'pin_one'}));
            $('ul.pins').append(pinsBar);
            var pinsButtons = $('div.pins-list').find('a');
            pinsButtons.tooltipsy({
                alignTo: 'element',
                offset: [1, 1]
            });
            pinsBar.hide();

            _this._loadPinsBarPanel();

            $('.pins').click(function () {
                _this.pinsSwitch();
            });

            var result_base = $('.search-box').data('base');
            if (result_base.lastIndexOf('/') == result_base.length - 1) {
                result_base = result_base.substring(0, result_base.length - 1);
            }

            search_box.setFormatData(function (data) {
                var d = $('<div>');
                d.html(data);
                d.find('a').each(function () {
                    $(this).attr('href', result_base + $(this).attr('href'));
                });
                return d.html();
            });
            //search_box.init();
            $('button.search-button').click(function () {
                $('.search-box').show();
                $('html, body').addClass('html-body-no-overflow');

                $("#textinput").focus();  //EPP-3817

                $("#content-wrap a").attr("tabIndex", -1);
                $("#content-wrap button").attr("tabIndex", -1);
                $("#content-wrap a").attr("aria-hidden", true);
                $("#content-wrap button").attr("aria-hidden", true);

                $(".search-box a").removeAttr("tabIndex");
                $(".search-box button").removeAttr("tabIndex");
                $(".search-box a").removeAttr("aria-hidden");
                $(".search-box button").removeAttr("aria-hidden");
            });

            var topBar = $(_.template(ToolsBar, {title: 'toolsbar', show: portal_instance.readerApiModes.extended}));
            $('ul.settings').append(topBar);
            var toolsButtons = $('div.tools-list').children();
            toolsButtons.tooltipsy({
                alignTo: 'element',
                offset: [1, 1]
            });
            topBar.hide();

            _this._handleToolBarButtons();

            $('.settings').click(function () {
                $('.tools-menu-button').data('tooltipsy') && $('.tools-menu-button').data('tooltipsy').hide();
                _this.toolbarSwitch();
            });
        },

        _handleToolBarButtons: function () {
            var _this = this;
            var props = {
                modal: false,
                wrapCSS: 'fancybox-modal fancybox-modal-contact',
                beforeShow: function () {
                    $(document).on('keydown.topbar-fancybox', function (event) {
                        if (event.target.nodeName.toUpperCase() !== "INPUT") {
                            if (event.keyCode == 27) {
                                $.fancybox.close();
                            }
                        }
                    });
                    $('.fancybox-overlay').not('.fancybox-wrap').on('click', function () {
                        $.fancybox.close();
                    });
                },
                helpers: {
                    overlay: {
                        locked: true,
                        scrolling: 'no',
                        autoDimensions: 'true',
                        closeEffect: 'none',
                        closeClick: true,
                        closeBtn: true,
                        css: {
                            'background': 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            };

            if(portal_instance.readerApiModes.extended) {
                var html = $('<button id="show_html" class="show_html hastip" title="Pokaż&nbspHTML">html</button>');
		        var epxml = $('<button id="show_epxml" class="show_epxml hastip" title="Pokaż&nbspepXml">epXml</button>');
                $('#contact_form').after(epxml).after(html);

                html.click(function (e) {
                    var moduleTOC = Utils.getModuleTOCEntry();
                    window.open(moduleTOC.data('ajaxUrl'));
                    return false;
                });

                epxml.click(function (e) {
                    var moduleTOC = Utils.getModuleTOCEntry();
                    window.open(moduleTOC.data('epxmlUrl'));
                    return false;
                });
                $('.tools-list').width($('.tools-list').width() + 2 * (36 + 2 * 12));
            }


            $('#core_curriculum').click(function (e) {
                $('#core_curriculum').data('tooltipsy') && $('#core_curriculum').data('tooltipsy').hide();
                e.preventDefault();
                $.fancybox(_this._getWindowHref() + '/curriculum', $.extend({type: 'ajax'}, props));
                return true;
            });

            $('#license').click(function (e) {
                $('#license').data('tooltipsy') && $('#license').data('tooltipsy').hide();
                e.preventDefault();
                $.fancybox(_this._getWindowHref() + '/license', $.extend({type: 'ajax'}, props));
                return true;
            });

            $('#license_switch').click(function (e) {
                $('#license_switch').data('tooltipsy') && $('#license_switch').data('tooltipsy').hide();
                localStorage.epoLicenseOn = (localStorage.epoLicenseOn == 'on' ? 'false' : 'on');
                _this.trigger('toggleWOMILicense');
                return true;
            });

            if(portal_instance.readerApiModes.debug) {
                var altTextToggler = $('<button class="alttext">');
                $('#contact_form').after(altTextToggler);

                altTextToggler.click(function () {
                    localStorage.epoAltText = (localStorage.epoAltText == 'on' ? 'false' : 'on');
                    _this.trigger('toggleWOMIAltText');
                });
                $('.tools-list').width($('.tools-list').width() + 36);
            }

            //var fontSizeValue = 100;
            //var content = $('.reader-content');
            //var increaseBtn = $('#font_size_increase');
            //var decreaseBtn = $('#font_size_decrease');

            //function displayFontSizeButtons(){
            //	$('.hastip').data('tooltipsy') && $('.hastip').data('tooltipsy').hide();
            //    if (fontSizeValue <= 100) {
            //        decreaseBtn.css('display', 'none');
            //        increaseBtn.css('display', 'block');
            //    }
            //    else if((fontSizeValue > 100)&& (fontSizeValue < 175)){
            //        decreaseBtn.css('display', 'block');
            //        increaseBtn.css('display', 'block');
            //    }
            //    else if(fontSizeValue >= 175){
            //        decreaseBtn.css('display', 'block');
            //        increaseBtn.css('display', 'none');
            //    }
            //}

            //decreaseBtn.click(function () {
            //	decreaseBtn.data('tooltipsy') && decreaseBtn.data('tooltipsy').hide();
            //    if (fontSizeValue > 100) {
            //        fontSizeValue = fontSizeValue - 25;
            //        content.css('font-size', fontSizeValue + '%');
            //        increaseBtn.removeClass('disabled');
            //    }
            //    if (fontSizeValue <= 100) {
            //        decreaseBtn.addClass('disabled');
            //    }
            //    displayFontSizeButtons();
            //    return false;
            //});

            //increaseBtn.click(function () {
            //	increaseBtn.data('tooltipsy') && increaseBtn.data('tooltipsy').hide();
            //    if (fontSizeValue < 175) {
            //        fontSizeValue = fontSizeValue + 25;
            //        content.css('font-size', fontSizeValue + '%');
            //        decreaseBtn.removeClass('disabled');
            //    }
            //    if (fontSizeValue >= 175) {
            //        increaseBtn.addClass('disabled');
            //    }
            //    displayFontSizeButtons();
            //    return false;
            //});
            //displayFontSizeButtons();
        },

        _loadPinsBarPanel: function () {
            var _this = this;
            var pinsContainers = $('div.pins-list').children();
            var slides = [];
            var elements = [
                {name: 'Wideo', validClass: 'movie-container'},
                {name: 'Zdjecia', validClass: 'image-container'},
                {name: 'Załączniki', validClass: 'attachment-container'},
                {name: 'Obiekty', validClass: 'interactive-object-container'}
            ];

            this.on('hidePins', function () {
                _.each(slides, function (slide) {
                    slide.hide();
                });
            });

            _.each(pinsContainers, function (containerElement) {
                _.each(elements, function (el) {
                    if (el.validClass == containerElement.id) {
                        var container = $(containerElement);
                        var sld = new PinsPanelSlide({ element: el, slides: slides });
                        slides.push(sld);
                        container.append(sld.$el);
                        var button = $(containerElement).find('a').first();
                        var firstTime = true;
                        button.click(function (e) {
                            $('.hastip').data('tooltipsy') && $('.hastip').data('tooltipsy').hide();
                            e.preventDefault();
                            _.each(slides, function (slide) {
                                if (slide != sld) {
                                    slide.hide();
                                }
                            });
                            var slideElement = sld.render();
                            if (firstTime) {
                                firstTime = false;
                                slideElement.hide().slideDown();
                            } else {
                                slideElement.slideToggle();
                            }
                            return false;
                        });
                    }
                });
            });

        },

        _getWindowHref: function () {
            var windowHref = window.location.href;
            var anchorIdx = windowHref.lastIndexOf('#');
            if (anchorIdx != -1) {
                windowHref = windowHref.substr(0, anchorIdx);
            }
            return windowHref;
        },

        _getWidthWithPaddings: function (element) {
            return element.outerWidth() + element.outerWidth() - element.width();
        }


    })
});
