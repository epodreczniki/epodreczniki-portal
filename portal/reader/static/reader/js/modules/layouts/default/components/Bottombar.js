define(['jquery',
    '../../Component',
    'underscore',
    'backbone',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/layouts/default/components/Tiles',
    'modules/core/WomiManager',
    'modules/core/HookManager',
    'text!../templates/PaginationLinks.html',
    './includes/content-expanding'], function ($, Component, _, Backbone, Logger, Utils, Tiles, WomiManager, HookManager, PaginationLinks, ContentExpanding) {
    var activeClass = Utils.activeClass;
    var commonBase = require('common_base');
    var previousModuleIdx = 0;

    var hashTool = {};
    //hack to replace state of hash
    (function (namespace) { // Closure to protect local variable "var hash"
        if ('replaceState' in history) { // Yay, supported!
            namespace.replaceHash = function (newhash) {
                if (('' + newhash).charAt(0) !== '#') newhash = '#' + newhash;
                history.replaceState('', '', newhash);
            }
        } else {
            var hash = location.hash;
            namespace.replaceHash = function (newhash) {
                if (location.hash !== hash) history.back();
                location.hash = newhash;
            };
        }
    })(hashTool);


    return Component.extend({
        name: 'Bottombar',
//        elementSelector: '[data-component="bottombar"]',
        elementSelector: '[data-component="bottombar-navigation"]',
        load: function () {
            var _this = this;
            this.modules = $('#index-menu').find('.module-a');

            this.listenTo(this._layout, 'moduleLoadingStart', function (state) {
                _this.setActiveClass(state.moduleElement);
            });

            this.addNavigationHandlers();

            this.listenTo(this._layout, 'goToPrevOrNextModule', function (offset) {
                _this.goToPrevOrNextModule(offset);
            });

            this.updateNavigation();

            this.listenTo(this._layout, 'moduleLoaded', function (state) {
                _this.paginationForModule(state);

            });

            HookManager.addHook('loadModuleHook', _.bind(this._hook, this));
        },

        _hook: function(kernel, module, click, save){
            if(module.hasClass('link-active')){
                if(this.pages && this.curPage > 0){
                    if (!location.hash || $('.pagination-page:first ' + location.hash).length) {
                        this.curPage = 1;
                        this.goToPrevOrNextModule(0, true);
                        $('.grid').css('visibility', 'initial');
                    }
                    return false;
                }
            }
            return true;
        },

        updateNavigation: function () {
            var _this = this;
            this.modules.each(function (index, element) {
                if ($(element).hasClass(activeClass)) {
                    _this.updateNavigationButtons(index, _this.modules.length);
                }
            });
        },

        updateNavigationButtons: function (current, size) {

            var _this = this;

            if (current + 1 >= size || size <= 1) {
                _this.hideNavigationNext();
            } else {
                _this.showNavigationNext();
            }

            if (this.pages) {
                if (current - 1 <= 0 || size <= 1) {
                    _this.hideNavigationPrev();
                } else {
                    _this.showNavigationPrev();
                }
            }else{
                if (current - 1 < 0 || size <= 1) {
                    _this.hideNavigationPrev();
                } else {
                    _this.showNavigationPrev();
                }
            }
        },

        showNavigationNext: function (){
            var ACTIVE_CLASS = 'active';
            var DISABLED_CLASS = 'disabled';
            var nextBtn = $('.navigation-right').find('button');
            var nextBtnBottom = $('.bottom-content-navigation').find('button.bottom-content-forward');
            nextBtnBottom.removeClass(DISABLED_CLASS);
            nextBtnBottom.addClass(ACTIVE_CLASS);
            nextBtn.show();
            nextBtnBottom.show();
        },

        hideNavigationNext: function (){
            var ACTIVE_CLASS = 'active';
            var DISABLED_CLASS = 'disabled';
            var nextBtn = $('.navigation-right').find('button');
            var nextBtnBottom = $('.bottom-content-navigation').find('button.bottom-content-forward');
            nextBtnBottom.removeClass(ACTIVE_CLASS);
            nextBtnBottom.addClass(DISABLED_CLASS);
            nextBtn.hide();
            nextBtnBottom.hide();
        },

        showNavigationPrev: function (){
            var ACTIVE_CLASS = 'active';
            var DISABLED_CLASS = 'disabled';
            var prevBtn = $('.navigation-left').find('button');
            var prevBtnBottom = $('.bottom-content-navigation').find('button.bottom-content-back');
            prevBtnBottom.removeClass(DISABLED_CLASS);
            prevBtnBottom.addClass(ACTIVE_CLASS);
            prevBtn.show();
            prevBtnBottom.show();
        },

        hideNavigationPrev: function (){
            var ACTIVE_CLASS = 'active';
            var DISABLED_CLASS = 'disabled';
            var prevBtn = $('.navigation-left').find('button');
            var prevBtnBottom = $('.bottom-content-navigation').find('button.bottom-content-back');
            prevBtnBottom.removeClass(ACTIVE_CLASS);
            prevBtnBottom.addClass(DISABLED_CLASS);
            prevBtn.hide();
            prevBtnBottom.hide();
        },

        goToPrevOrNextModule: function (offset, quickshow) {
            //var modules = $('#index-menu').find('.module-a');
            var foundIdx = -1000;
            var foundElement = null;
            var curPage = 0;
            var pagesLen = 0;
            var thisComponent = this;
            var womiResizeNeeded = true;

            this.modules.each(function (index, element) {
                if ($(element).hasClass(activeClass)) {
                    foundIdx = index;
                    foundElement = $(element);
                    return false;
                }
                return true;
            });


            if (this.pages) {
                var target = Utils.getMainContentPlaceholder();
                var tmp = this.curPage;
                this.curPage += offset;
                if (foundIdx < previousModuleIdx) {
                    this.curPage = this.pages.length;
                    previousModuleIdx = foundIdx;
                }

                curPage = this.curPage;
                pagesLen = this.pages.length;

                if ((this.curPage > this.pages.length) || this.curPage <= 0) {
                    this.curPage = tmp;
                    curPage = this.curPage;
                } else {
                    var i = 1;
                    var cur = this.curPage;
                    var w = target.width();
                    var scanIndicator = 0;
                    var targetStyle = target.attr('style') || '';

                    function addHash(page) {
                        var elem = page.find('> div').first();
                        var id = elem.attr('id');
                        if (id) {
                            if(page.data('page-number') > 0 || location.hash) {
                                elem.attr('id', '');
                                window.location.hash = '#' + id;
                                elem.attr('id', id);
                            }
                        }
                    }

                    var pages = this.pages;
                    var fromPage = $('.pagination-page:not(.pagination-page-blurred)');
                    var newPage = pages[cur - 1];

                    function showPage(cur) {
                        $(pages).each(function () {
                            var page = $(this);
                            page[i != cur ? 'addClass' : 'removeClass']('pagination-page-blurred');
                            //page.css('display', (this.i ? 'none' : 'block'));
                            if (i == cur && !location.hash) {
                                addHash(page);
                            }
                            //reloadSizes();
                            thisComponent.hideLenses();
                            thisComponent.hideNotesPopup();
                            i++;
                        });
                    }

                    if (quickshow) {
                        fromPage.addClass('pagination-page-blurred');
                        newPage.removeClass('pagination-page-blurred');

                        if (!location.hash) {
                            addHash(newPage);
                        }

                        thisComponent.hideLenses();
                        thisComponent.hideNotesPopup();
                        $(document).scrollTop(0);
                    } else {
                        womiResizeNeeded = false;
                        $(target).animate({
                            'scrollLeft': newPage.next().is(fromPage) ? 0 : 2 * w
                        }, {
                            complete: function () {
                                fromPage.addClass('pagination-page-blurred');
                                newPage.css('opacity', '0').removeClass('pagination-page-blurred');
                                $(target).scrollLeft(w);
                                addHash(newPage);
                                $(document).scrollTop(0);
                                pages[cur - 1]['fadeTo']('1000', '1'); //slow
                                //pages[cur - 1]['css']('opacity','1'); //quick
                                WomiManager.resizeAll();

                            }
                        });
                    }
                    foundElement.parent().find('.pagination-pages').find('li a').removeClass(activeClass);
                    foundElement.parent().find('.pagination-pages').find('li').filter(function() {
                        return $(this).attr('data-page-num') <= (cur ? cur : 1);
                    }).last().find('a').addClass(activeClass);

                    this.trigger('selectedPage', {page: (cur ? cur : 1), pageElement: newPage, pagesLen: pages.length});
                    //$('body').animate({ scrollTop: 0 }, 500);
                    this.updateNavigationButtons(foundIdx + curPage, this.modules.length + pagesLen);
                    // ET-1411 BEGIN
                    var win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = win.innerWidth || e.clientWidth || g.clientWidth;
                    if (x < 776) {
                        this.trigger('gridClicked');
                    }
                    // ET-1411 END


                    // EPP-7403 BEGIN Wrong sizes of WOMIs
                    //this.alterPageForChromeRenderer();  // not needed if we do this:
                    if (womiResizeNeeded) {
                        WomiManager.resizeAll();
                    }
                    // EPP-7403 END
                    return;
                }
            }

            previousModuleIdx = foundIdx;
            foundIdx = foundIdx + offset;

            var m = null;
            if (foundIdx < this.modules.length && foundIdx >= 0) {
                m = $(this.modules.get(foundIdx));
                offset && $(m).loadModule(false);
            }

            this.updateNavigationButtons(foundIdx + curPage, this.modules.length + pagesLen);

            if ($('.collapse-tiles').length > 0) {
                $('.collapse-tiles').remove();
            }

            this.hideLenses();
            this.hideNotesPopup();

            return m;
        },

        /*alterPageForChromeRenderer: function () {
            //console.log("alterPageForChromeRenderer: check for Chrome/Safari...");
            try {
                // we need it only for Chrome/Safari
                if ('WebkitAppearance' in document.documentElement.style) {
                    //console.log("alterPageForChromeRenderer: yes, it is.");

                    var parelt = $(".pagination-page:not(.pagination-page-blurred) .section.level_1")[0];
                    if (parelt) {
                        var remElt = $(".pagination-page:not(.pagination-page-blurred) .section.level_1 > .removeMe")[0];
                        var addElt = document.createElement("div");
                        addElt.innerHTML = " "; // Won't work if empty
                        addElt.className = "removeMe";
                        if (remElt) {
                            parelt.replaceChild(addElt, remElt);
                        } else {
                            parelt.appendChild(addElt);
                        }
                    }
                } else {
                    //console.log("alterPageForChromeRenderer: no, it's not.");
                }
            } catch (e) {
                console.log("Page was not altered for Chrome renderer because of: ",e);
            }

        },*/

        paginationForModule: function (state) {

            var oldPaginationPages = $('#table-of-contents .pagination-pages');
            if (oldPaginationPages.length > 0) oldPaginationPages.remove();  // erase old

            this.curPage = 1;

            var target = Utils.getMainContentPlaceholder();

            var sects = target.children().first().children('.section');
            if (sects.length && $(".bibliography")) {
                sects.push($(".bibliography").attr('data-start-new-page', "true").attr('id', target.children().first().attr('id') + '_bibliography'));
            }
            var pages = [];
            var page = null;
            var _this = this;
            sects.each(function (i) {
                var section = $(this);
                if (section.data('start-new-page')) {
                    page = $('<div class="pagination-page pagination-page-blurred">');
                    page.data('page-number', i);
                    section.parent().append(page);
                    pages.push(page);
                }
                page && page.append(section);
            });
            if (pages.length > 0) {
                target.addClass('pagination-active');
                this.pages = pages;
                pages[0].removeClass('pagination-page-blurred');
                target.scrollLeft(target.width());
                this.listenTo(this._layout, 'windowResize', function () {
                    if ($(pages).length) {
                        WomiManager.resizeAll();
                    }
                    target.scrollLeft(target.width());
                });
                var alreadyServed = false;

                function goto(fromPage) {
                    if(fromPage){
                        previousModuleIdx = -1000000;
                    }
                    if (window.location.hash != '#') {
                        var hash = window.location.hash;
                        $(pages).each(function (index, element) {
                            if ($(element).find(hash).length > 0 || $(element).attr('id') == hash.replace('#', '')) {
                                alreadyServed = true;
                                _this.goToPrevOrNextModule((!fromPage ? index : index + 1 - _this.curPage), true);
                                var firstHash = $('.pagination-page:not(.pagination-page-blurred) > div').first().attr('id');
                                if (firstHash && location.hash.substring(1) != firstHash) {
                                    $(location.hash)[0].scrollIntoView();
                                }
                            }
                        });
                    }
                }


                var url = window.location.href;
                var h = url.indexOf('#');
                if (h != -1) {
                    url = url.substr(0, h);
                }
                if (state.moduleElement) {
                    var ul = _.template(PaginationLinks, {
                        sections: _.map(pages, function (s, k) {

                            var id = $(s).find('.section').first().attr('id') || $(s).find('.bibliography').first().attr('id');
                            var header = $(s).find('.section:first .section-header:first');

                            if ($(s).find('.bibliography').length) {
                                header = $(s).find('.bibliography:first .bibliography-header:first');
                            }

                            if (header.length) {
                                header = header.find('.title').text();
                            } else {
                                header = 'Strona ' + (k + 1);
                                id = '';  // we check it in the template and omit this page
                            }

                            var content_status = "canon";
                            if ($(s).find('.section:first.content-status-expanding').length) {

                                content_status = "expanding";
                            }
                            if ($(s).find('.section:first.content-status-supplemental').length) {

                                content_status = "supplemental";
                            }
                            var content_recipient = "student";
                            if ($(s).find('.section:first.recipient-teacher').length) {

                                content_recipient = "teacher";
                            }
                            return {
                                id: id,
                                number: k + 1,
                                label: header,
                                content_status: content_status,
                                content_recipient: content_recipient
                            }
                        }),
                        base_url: url
                    });
                    $(state.moduleElement).after($(ul));
                }

                goto();
                _this.goToPrevOrNextModule(0, true);

                ContentExpanding.addTocExpanding();


                if (this.connected) {
                    $(window).off('hashchange.bottombarjs');
                }

                $(window).on('hashchange.bottombarjs', function (e) {
                    goto(true)
                });
                this.connected = true;

                //!this.historyStarted && Backbone.history.start() && (this.historyStarted = true);


            } else {
                target.removeClass('pagination-active');
                this.pages = null;
                this.curPage = 0;
                this.stopListening(this._layout, 'windowResize');
            }
        },

        hideLenses: function () {
            if ($('.lens-style').length > 0) {
                $('.lens-style').hide();
            }
        },

        hideNotesPopup: function() {
            if ($('.ep-note-popup').length > 0) {
                $('.ep-note-popup').removeAttr('style');
                $('.ep-note-popup').hide();
            }
        },

        setActiveClass: function (thisModule) {
            var moduleIdx = 0;
            var moduleElement;

            this.modules.each(function (index, element) {
                if ($(element)[0] != $(thisModule)[0] && $(element).hasClass(activeClass)) {
                    $(element).removeClass(activeClass);
                } else if ($(element)[0] == $(thisModule)[0] && !$(element).hasClass(activeClass)) {
                    $(element).addClass(activeClass);
                    moduleIdx = index;
                    moduleElement = element;
                }
            });

            this.updateNavigation();

            //this.updateNavigationButtons(moduleIdx, this.modules.length);
        },

        addNavigationHandlers: function () {
            var _this = this;

            $('button.left').attr('tabindex', '5');
            $('button.right').attr('tabindex', '6');

            $('.navigation-right, .bottom-content-forward').click(function () {
                _this.goToPrevOrNextModule(1);
            });

            $('.navigation-left, .bottom-content-back').click(function () {
                _this.goToPrevOrNextModule(-1);
            });

            $(document).ready(function () {
                if ($('#dialog_form').is(":visible")) {
                    if (navigator.userAgent.match(/Trident/)) {
                        setTimeout(function () {
                            $('#id_md_message').focus();
                        }, 100);
                    } else {
                        $('#id_md_message').focus();
                    }
                }
            });

            $(document).on('keydown.bottombar keypress.bottombar', function (event) {
                var target = event.target.nodeName.toUpperCase();
                if (target !== "INPUT" && target !== "SELECT" && !$(event.target).hasClass('show-scroll')
                        && $(event.target).attr('role') != 'slider') {
                    if ($('#dialog_form, #note-content').is(":visible")) {
                        $('#id_md_message').focus();
                    } else if (!$('.fancybox-overlay, .vjs-fullscreen').length) {
                        var y = $(window).scrollTop();
                        if (event.keyCode == 37) {  // left
                            _this.goToPrevOrNextModule(-1);
                            event.preventDefault();
                        } else if (event.keyCode == 39) {  // right
                            _this.goToPrevOrNextModule(1);
                            event.preventDefault();
                        } else if (event.keyCode == 38) {  // up
                            $(window).scrollTop(y - 150);
                            event.preventDefault();
                        } else if (event.keyCode == 40) {  // down
                            $(window).scrollTop(y + 150);
                            event.preventDefault();
                        } else if (event.keyCode == 32
                                   && event.target.type !== 'text'
                                   && event.target.type !== 'textarea') {  // spacebar
                            $(window).scrollTop(y + 400);
                            event.preventDefault();
                        }
                    } else {
                        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                            event.preventDefault();
                        }
                    }
                }
            });
        }
    });
});
