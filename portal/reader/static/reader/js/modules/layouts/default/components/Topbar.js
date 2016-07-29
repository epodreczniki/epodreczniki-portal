define([
    'jquery',
    'underscore',
    '../../Component',
    'tocUtils',
    'EpoAuth',
    'modules/utils/ReaderUtils',
    //'search_box',
    'portal_instance'
], function ($, _, Component, tocUtils, EpoAuth, Utils, /*search_box,*/ portal_instance) {

    return Component.extend({

        name: 'Topbar',

        events: {
            // 'click button.settings': 'handleSettingsClick',
            // 'click #close-top-dropdown': 'handleCloseDropdownClick'
        },

        postInitialize: function (options) {
            this.setElement($('#topbar'));

            this.$tocDropdown = this.$el.find('.top-dropdown');

            this.profileElement = this.$el.find('.profile');
            this.loginElement = this.$el.find('.login');

            var leftNavi = $('#contentbar').find(".left-navigation").find('.title-page-num');

            this.listenTo(this._layout, 'moduleLoaded', function (module) {
                var moduleName = tocUtils.activeModule();
                this.setModuleTitle(moduleName);

                var maduleTitle = leftNavi.find('.module-title');
                if(maduleTitle.length == 0){
                    maduleTitle = $('<div class="module-title">');
                    leftNavi.append(maduleTitle);
                }
                maduleTitle.html('<span>' + moduleName + '</span>');

                leftNavi.find('.page-info').remove();
            });

            this.listenTo(this, 'showTopbar', this.showTopbar());

            this.listenTo(this._layout, 'selectedPage', function(data){
                var maduleTitle = leftNavi.find('.module-title');

                var pageName;
                if(data.page == 1 && data.pageElement.find('.section').first().find('.section-header').length == 0){
                    pageName = tocUtils.activeModule();
                } else {
                    pageName = data.pageElement.find('.section').first().find('.section-header').first().find('span.title').first().text();
                }

                maduleTitle.html('<span>' + pageName + '</span>');

                var pInfo = leftNavi.find('.page-info');
                if(pInfo.length == 0){
                    pInfo = $('<div class="page-info">');
                    leftNavi.append(pInfo);
                }
                if(data.pageElement.find('.section').first().data('role')){
                    pInfo.html('<span>&nbsp;' + data.pageElement.find('.section').first().data('role') + '</span>');
                } else if (maduleTitle.text().trim()) {
                    pInfo.html('<span>&nbsp;&ndash;&nbsp;strona ' + data.page + ' z ' + data.pagesLen + '</span>');
                } else {
                    pInfo.html('<span>Strona ' + data.page + ' z ' + data.pagesLen + '</span>');
                }
            });

//            this.listenTo(EpoAuth, EpoAuth.POSITIVE_PING, _.bind(function(data){
//                this.profileElement.html('<span class="icon-20"></span><span class="icon-title">' + data.user + "</span>");
//                this.profileElement.show();
//                this.loginElement.hide();
//            }, this));
//
//            this.listenTo(EpoAuth, EpoAuth.NEGATIVE_PING, _.bind(function(data){
//                this.profileElement.hide();
//                this.loginElement.show();
//            }, this));

            this.listenTo(this._layout, 'gridClicked', function () {
                this.handleCloseDropdownClick();
            }, this);

            this.render();

            this.handleWindowScroll();

            // TODO: Don't know whats going on, check this ASAP
            var result_base = $('.search-box').data('base');
            if(result_base){
                if (result_base.lastIndexOf('/') == result_base.length - 1) {
                    result_base = result_base.substring(0, result_base.length - 1);
                }
            }

            //search_box.init();
            this._handleToolBarButtons();

            if (localStorage.epoAltText === 'on') {
                 $(".left-navigation").append("<div class=\'plaintext\'>Tekst alternatywny włączony</div>");
                 $('.alttext').removeClass('on').addClass(localStorage.epoAltText === 'on' ? 'on' : '');
            }

            $('#license_switch').toggleClass('on', localStorage.epoLicenseOn === 'on');
            $('#alt_desc_switch').toggleClass('on', localStorage.epoAltDescOn === 'on');
        },

        render: function () {

            this.loginElement.click(function () {
                $(this).attr('href', $(this).data('login-view') + '?next=' + window.location.href);
                return true;
            });
            //this.$el.html(this.template());
        },

        setModuleTitle: function (title) {
            this.$('.title').html(title);
        },


        handleWindowScroll: function () {
            var previousScroll = $(window).scrollTop();
            var scrollCheck;

            $(document).scroll(_.debounce(function () {
                var currentScroll = $(window).scrollTop();

                if (currentScroll <= $(document).height() - $(window).height()) {
                    if (currentScroll < previousScroll || currentScroll < 40) {
                        this.showTopbar();
                    } else {
                        this.hideTopbar();
                    }

                    previousScroll = currentScroll;
                }

            }.bind(this), 30));
        },

        hideTopbar: function () {
            this.$el.removeClass('is-visible').addClass('topbar-animate is-hidden');
            this.handleCloseDropdownClick();
            // TODO: Think about It few times more
            var breakpoint = $('#header-image').innerHeight();
            if ($(window).scrollTop() >= breakpoint) {
                $('#contentbar').addClass('onTop').removeClass('underTopbar');
                ;
            }
        },

        showTopbar: function () {
            // TODO REFACTOR 
            var currentScroll = $(window).scrollTop();
            this.$el.removeClass('topbar-animate is-hidden')
                .addClass('is-visible ' + ((currentScroll <= 40) ? '' : 'topbar-animate'));
            var breakpoint = $('#header-image').innerHeight();
            // Breakpoint > 0 to prevent no-header-image toggling classes
            if (currentScroll < breakpoint && breakpoint > 0) {
                $('#contentbar').removeClass('onTop underTopbar');
                ;
            } else {
                $('#contentbar').removeClass('onTop').addClass('underTopbar');
            }
        },

        handleSearchClick: function () {
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
        },

        handleSettingsClick: function () {
            if ($('.top-dropdown').is(':visible')) {
                this.handleCloseDropdownClick();
            } else {
                $('#license_switch').removeClass('on').addClass(localStorage.epoLicenseOn === 'on' ? 'on' : '');
                $('button.settings').addClass('open');
                this.$tocDropdown.fadeIn();
            }
        },

        handleCloseDropdownClick: function () {
            this.$tocDropdown.fadeOut();
            $('button.settings').removeClass('open');
        },

        _handleToolBarButtons: function () {
            // TODO: Need to refactor this too.
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
                },
                afterShow: function () {
                    $('a.fancybox-close').addClass('fancybox-close-topbar');
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

            if (portal_instance.readerApiModes.extended) {
                var html = $('<li><button id="show_html" class="show_html" title="Pokaż&nbspHTML">[html]</button></li>');
                var epxml = $('<li><button id="show_epxml" class="show_epxml" title="Pokaż&nbspepXml">[epXml]</button></li>');
                $('#epxml-switcher').after(epxml);
                $("#html-switcher").after(html);

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
                $('#license_switch').removeClass('on').addClass(localStorage.epoLicenseOn === 'on' ? 'on' : '');
                _this.trigger('toggleWOMILicense');
                return true;
            });

            $('#alt_desc_switch').click(function (e) {
                $('#alt_desc_switch').data('tooltipsy') && $('#alt_desc_switch').data('tooltipsy').hide();
                localStorage.epoAltDescOn = (localStorage.epoAltDescOn == 'on' ? 'false' : 'on');
                $('#alt_desc_switch').removeClass('on').addClass(localStorage.epoAltDescOn === 'on' ? 'on' : '');
                //_this.trigger('toggleWOMIAltDesc');
                $('.disabledAlt').toggle(localStorage.epoAltDescOn === 'on');
                return true;
            });

            if (portal_instance.readerApiModes.debug) {
                var altTextToggler = $('<button>', {
                    class: 'alttext',
                    text: 'tekst alternatywny'
                }).append('<span class="tick-icon"></span>');

                $('#alt-text-switcher').html(altTextToggler);


                altTextToggler.click(function () {
                    localStorage.epoAltText = (localStorage.epoAltText == 'on' ? 'false' : 'on');

                    if (localStorage.epoAltText === 'on') {
                        $(".plaintext").detach();
                        $(".left-navigation").append("<div class=\'plaintext\'>Tekst alternatywny włączony</div>");
                    }
                    else {
                        $(".plaintext").detach();
                    }

                    $('.alttext').removeClass('on').addClass(localStorage.epoAltText === 'on' ? 'on' : '');

                    _this.trigger('toggleWOMIAltText');
                });
            }
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
    });


});
