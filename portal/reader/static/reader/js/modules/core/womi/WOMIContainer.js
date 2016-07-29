//>startExclusion
{% load engines %}
//>endExclusion
define(['jquery',
    'backbone',
    'underscore',
    'modules/core/Registry',
    './WOMIContainerBase',
    'layout',
    'modules/core/WomiManager',
    'modules/core/HookManager',
    './WOMIMenuLayout',
    'portal_instance'], function ($, Backbone, _, Registry, Base, layout, womi, HookManager, WOMIMenuLayout, portal_instance) {
    var deviceDetection = require('device_detection');

    //>startExclusion
    var LICENSES = {% autoescape off %}{{ LICENSE_LIST|to_json }}{% endautoescape %};
    //>endExclusion

    function resolveLicense(value, key){
        for(var l in LICENSES){
            if(LICENSES[l][key] == value){
                return LICENSES[l];
            }
        }
        return resolveLicense('CC0', 'id');
    }

    var WOMIContainer = Base.extend({

        initialize: function (options) {
            this.init(this.$el);
        },
        init: function (element) {
            this.roles = {};
            this._mainContainerElement = $(element);
            this.menuItems = [];
            var _this = this;
            this._mainContainerElement[0].addEventListener('fullscreen', function () {
                _this._fullscreenMenuItem().callback();
            });
            this._initAll();

            this.on('openContext', function () {
                _this._fullscreenMenuItem().callback();
            });
        },

        _initAll: function () {
            var container = $(this._mainContainerElement);
            container.data('womiObject', this);

            var roles = {};
            if (container.data('roles')) {
                var r = container.data('roles').split(',');
                roles = _.object(r, _.map(r, function () {
                    return true
                }));
            }

            var related = container.find('.related');
            related = (related.length > 0 ? related : null);
            if (related) {
                related = new WOMIContainer({el: related.children() });
            }

            var divs = container.not('.related').find('.classic').first();
            var contentClassic = divs.data('content');
            var textContent = divs.find('.womi-text-content');
            if(textContent.length == 1){
                contentClassic = textContent.html();
                textContent.remove();
            }

            this.classic = {
                options: {
                    title: container.data('title'),
                    partTitle: container.data('part-title'),
                    roles: roles,
                    content: contentClassic,
                    related: related,
                    womiId: container.data('womi-id'),
                    functions: {
                        resolveLicense: resolveLicense
                    }
                }
            };
            divs = divs.children();
            this.classic.options.alt = divs.data('alt');
            var className = this._resolveObjectClassType(divs);
            this.classic.object = new (this.CLASS_MAPPINGS())[className]({el: divs, options: this.classic.options, parent: this});

            var mobile = container.not('.related').find('.classic').first();

            var contentMobile = mobile.data('content');
            textContent = mobile.find('.womi-text-content');
            if(textContent.length == 1){
                contentMobile = textContent.html();
                textContent.remove();
            }
            if (mobile) {
                this.mobile = {
                    options: {
                        title: container.data('title'),
                        partTitle: container.data('part-title'),
                        roles: roles,
                        content: contentMobile,
                        related: related,
                        womiId: container.data('womi-id'),
                        functions: {
                            resolveLicense: resolveLicense
                        }
                    }
                };
                divs = mobile.children();
                this.mobile.options.alt = divs.data('alt');
                className = this._resolveObjectClassType(divs);
                this.mobile.object = new (this.CLASS_MAPPINGS())[className]({el: divs, options: this.mobile.options, parent: this});
            }
            this.selected = this.classic;

            this.menuItems = [];
        },

        getTitleAndContent: function(){
            return {
                title: this.selected.object.options.title,
                partTitle: this.selected.object.options.partTitle,
                content: this.selected.object.options.content
            }
        },

        _renderMenu: function () {
            this.menuItems = [];
            var fsItem = this._fullscreenMenuItem();
            if (fsItem) {
                this.menuItems.push(fsItem);
            }
            if(this.selected.object){
                var manageButtons = this.selected.object.getWomiManageButtons();
                var _this = this;
                if(manageButtons){
                    _.each(manageButtons, function(btn){
                        _this.menuItems.push(btn);
                    });
                }
            }

            return this._generateMenu();
        },

        avatarContainer: function (container, config) {
            function res() {
                var a = $(window).height() * config.heightPercent;
                var b = a * config.ratio;
                $(container).css({
                    width: b,
                    height: a
                }).addClass('womi-avatar');
            }
            res();
            this.selected.object.on('resized', function () {
                res();
            });
            HookManager.executeHook('avatarCreatedHook', [container, config]);
        },

        render: function () {
            var container = this._mainContainerElement;
            container.html('');
            if (this.selected.options.roles.context && !this.selected.options.roles.embedded) {
                container.hide();
                return;
            }

            if (this.selected.options.roles.avatar) {
                container.append(this.selected.object.render());
                this.avatarContainer(container, _.extend({heightPercent: 0.25, ratio: 1}, this.selected.object.avatarConfig()));
                this.selected.object.trigger('renderDone');
                return;
            }


            if (this.selected.options.title) {
                container.append('<div class="title">' + this.selected.options.title + '</div>');
            }
            var selectedEl = this.selected.object.render();
            container.append(selectedEl);

            var content = this.classic.options.content;
            if (deviceDetection.isMobile) {
                if (this.mobile && this.mobile.options.content) {
                    content = this.mobile.options.content;
                }
            }
            if (content && content != '') {
                this._content = content;
                container.append($('<div>', {'class': 'caption', html: content}));
            }
            var menu = this._renderMenu();
            container.append(menu);

            if (this.selected.options.roles.transparent) {
                selectedEl.css('visibility', 'hidden');
                menu.css('display', 'none');
                container.click(_.bind(function () {
                    this.trigger('openContext');
                }, this));
            }

            this.selected.object.trigger('renderDone');
        },

        _lookForBlocks: function () {
            if (this._mainContainerElement.parent().hasClass('related')) {
                this._stopLoad = true;
                this._discoverTitle = function () {
                };
            }
            //console.log(this._mainContainerElement.not('.related'), this._mainContainerElement);
            this._classic = $(this._mainContainerElement.not('.related').find('.classic').first());
            this._mobile = $(this._mainContainerElement.not('.related').find('.mobile').first());
            this._related = $(this._mainContainerElement.find('.related'));
            this._related = (this._related.length > 0 ? this._related : null);
            //this._selectedBlock = this._mobile.length && this._mobile.data('auto') && epGlobal.isMobile ? this._mobile : this._classic;
            this._selectedBlock = this._classic;

            this._lastClickedMenuItem = null;
        },
        _discoverTitle: function (notAppend) {
            var title = this._mainContainerElement.data('title');

            if (title && title != '') {
                this._title = title;
                if (!notAppend) {
                    this._mainContainerElement.prepend($('<div>', { 'class': 'title', html: title}));
                }
            }
        },
        show: function(){
            this._mainContainerElement.show();
        },
        hide: function(){
            this._mainContainerElement.hide();
        },
        isShown: function() {
            return this._mainContainerElement.css('display') !== 'none';
        },
        _discoverContent: function () {
            var _this = this;
            var roles = this._mainContainerElement.data('roles');
            this.roles = {};
            if (roles) {
                var r = roles.split(',');
                this.roles = _.object(r, _.map(r, function () {
                    return true
                }));
            }
            var zoomable = this._mainContainerElement.data('zoomable');
            if (zoomable) {
                this.roles.zoomable = zoomable;
            }
            if (this.roles.context && !this.roles.avatar) {
                this._stopLoad = true;
                this._discoverTitle(true);
                this._mainContainerElement.css('display', 'none');
            } else if (this.roles.context && this.roles.avatar) {
                this._discoverTitle(true);
            } else if (this.roles.transparent) {
                this._discoverTitle(true);
                this._classic.css('visibility', 'hidden');
                this.__fs = this._fullscreenMenuItem;
                this._fullscreenMenuItem = function () {
                    return null;
                };
                this._mainContainerElement.click(function () {
                    var call = _this.__fs();
                    call && call.callback();
                });
                if (this._mobile.length) {
                    this._mobile.css('visibility', 'hidden');
                }
            } else {
                //discover title
                this._discoverTitle();
            }
            //discover all blocks

            var divs = this._classic.children();
            //initialize content
            var className = this._resolveObjectClassType(divs);
            this._classic.womiObj = new (this.CLASS_MAPPINGS())[className]({el: divs});
            this._classic.womiObj._related = this._related;
            this._classic.womiObj.getMenuItems().forEach(function (entry) {
                var item = {
                    name: 'classic' + entry.name,
                    callback: function () {
                        _this._lastClickedMenuItem = item;
                        _this.switchToClassic();
                        entry.callback();
                        return false;
                    }
                };
                _this.menuItems.push(item);
            });

            if (this._mobile.length) {
                divs = this._mobile.children();
                className = this._resolveObjectClassType(divs);
                this._mobile.womiObj = new (this.CLASS_MAPPINGS())[className]({el: divs});
                this._mobile.womiObj._related = this._related;
                this._mobile.womiObj.getMenuItems().forEach(function (entry) {
                    var item = {
                        name: 'mobile' + entry.name,
                        callback: function () {
                            _this._lastClickedMenuItem = item;
                            _this.switchToMobile();
                            entry.callback();
                            return false;
                        }
                    };
                    _this.menuItems.push(item);
                });
            }
            this._selectedBlock.womiObj.setRoles(this.roles);
            var fsItem = this._fullscreenMenuItem();
            if (fsItem) {
                this.menuItems.push(fsItem);
            }

            var womiManageButtons = _this._selectedBlock.womiObj.getWomiManageButtons();
            if (!deviceDetection.isMobile && womiManageButtons != null) {
                for (var item in womiManageButtons) {
                    _this.menuItems.push({
                        name: item,
                        callback: function () {
                            (womiManageButtons[this.name])();
                            return false;
                        }
                    });
                }
            }
            if (!this._stopLoad) {
                this.load();
            }
        },
        contextCallback: function () {
            if (this.selected.object.contextCallback) {
                this.selected.object.contextCallback();
                return true;
            }
            return false;
        },
        _fullscreenMenuItem: function () {
            var _this = this;
            if (_this.selected.object.hasFullscreenItem) {
                if (!_this.selected.object.hasFullscreenItem()) {
                    return null;
                }
            }
            return {
                name: 'fullscreen',
                callback: function () {
                    var fsElement = _this.selected.object.getFSElement();
//                    fsElement.afterLoad(function(){
//
//                    });

                    _this.selected.object.setRoles(_this.roles);
                    if (fsElement != null) {
                        $.fancybox.open(fsElement.element, $.extend({
                            loop: false,
                            margin: 1,
                            padding: 1,
                            scrolling: 'no',
                            beforeLoad: function () {
                            },
                            afterShow: function () {
                                if (fsElement.afterLoad && !fsElement.loaded) {
                                    fsElement.afterLoad();
                                }
                                _this.closeButtonConfigure();
                                //$('.fancybox-inner').css('overflow', 'hidden');
                                $('body').css('overflow', 'hidden');
                                $()
                            },
                            onUpdate: function () {
                                if (fsElement.cancelUpdate) {
                                    return;
                                }
                                if (fsElement.loaded) {
                                    fsElement.loaded = false;

                                    $(".fancybox-overlay").on("remove", function () {
                                        setTimeout(function () {
                                            _this._fullscreenMenuItem().callback();
                                        }, 300);
                                    });
                                    $.fancybox.close(true);
                                } else {
                                    fsElement.loaded = true;
                                }
                            },
                            afterClose: function () {
                                fsElement.afterClose && fsElement.afterClose();
                                $('div.tooltipsy').remove();
                                $('body').css('overflow', '');
                            }
//                            helpers: {
//                                overlay: {
//                                    locked: true
//                                }
//                            }
                        }, fsElement.options));
                    }
                    return false;
                }
            };
        },
        _getBetterFSSize: function (width, height) {
            var currW = typeof width === 'undefined' ? this._mainContainerElement.width() : width;
            var currH = typeof height === 'undefined' ? this._mainContainerElement.height() : height;
            var ratio = currW / currH;
            var props = {};
            props.padding = 3;
            props.margin = 3;
            var offset = 2 * props.margin + 2 * props.padding;
            if (ratio <= 1) {
                props.width = $(window).width() - offset;
                props.height = $(window).width() * ratio - offset;
            } else {
                props.height = $(window).height() - offset;
                props.width = $(window).height() * ratio - offset;
            }
            props.autoSize = false;
            //props.autoCenter = false;

            return props;
        },
        load: function () {
            this._selectedBlock.womiObj.load();
            //this._menuInit();
            var generated = this._selectedBlock.find('[class^=generated]');
            if (generated.length) {
                var content = this._selectedBlock.data('content');
                if (deviceDetection.isMobile) {
                    if (this._mobile.length > 0) {
                        content = this._mobile.data('content') || content;
                    }
                }
                if (content && content != '') {
                    this._content = content;
                    $(generated[0]).after($('<div>', {'class': 'caption', html: content}));
                }
            }
            this._generateMenu();
        },
        dispose: function () {
            this.selected.object.dispose();
        },
        switchToClassic: function () {
            this.selected.object.dispose();
            this.selected = this.classic;
            this._switchCallback();
        },
        switchToMobile: function () {
            this.selected.object.dispose();
            this.selected = this.mobile;
            this._switchCallback();
        },
        _switchCallback: function () {
        },
        _resolveObjectClassType: function (divs) {
            if (divs.length > 1) {
                return 'multiple';
            } else {
                if (divs[0]) {
                    return divs[0].className;
                } else {
                    return 'dummy';
                }
            }
        },
        _licenseUrl: function () {
            if (this.selected.object._licenseUrl) {
                return this.selected.object._licenseUrl();
            }
            return '';
        },
        hasButtons: function(){
            return this.selected.object.hasButtons();
        },
        _licenseItem: function () {
            var _this = this;
            require('modules/core/WomiManager').womiEventBus.on('toggleWOMILicense', function () {
                _this._menuContainer.find('li > .license').toggle();
            });
            var defaultObj = {
                license: 'brak'
            };

            function fancyCreate(object) {
                var element = $('<div>', {'class': 'meta-reader-info'});
                object = _.extend(defaultObj, object);
                object.author && element.append('<h3>autor: <em>' + object.author + '</em></h3>');
                //object.license = (object.license == 'PŁ' ? 'Politechnika Łódzka' : object.license);
                var _license = resolveLicense(object.license, 'id');
                element.append('<h3>licencja: <em>' + _license.name + '</em>' + (_license.link !== '' ? ( '<br><a href="' + _license.link + '">' + _license.link + '</a>'): '') + '</h3>');

                if(object.licenseAdditionalInfo){
                    element.append('<p>' + object.licenseAdditionalInfo + '</p>');
                }

                _this._fancyBoxPattern(element);
            }

            return {
                name: 'license',
                callback: function () {
                    var lic = _this._licenseUrl();
                    if (lic.type == 'source') {
                        $.get(lic.src, function (data) {
                            fancyCreate(data);
                        }, 'json');
                    } else if (lic.type == 'object') {
                        fancyCreate(lic.src);
                    }

                    return false;
                }
            }
        },

        _fancyBoxPattern: function(element){
            $.fancybox.open({
                wrapCSS: 'fancybox-modal',
                content: element,
                loop: false,
                margin: 1,
                padding: 1,
                scrolling: 'no',
                width: '66%',
                height: 'auto',
                afterShow: function () {
                    $('a.fancybox-close').addClass('fancybox-close-topbar');
                },
                helpers: {
                    overlay: {
                        closeClick: true,
                        closeBtn: true,
                        locked: false,
                        css: {
                            'background': 'rgba(255, 255, 255, 0.6)'

                        }
                    }
                }
            });
        },

        _altTextItem: function(){
            var _this = this;

            var altTextContainer = $('<div class="alt-text-container">' + _this.selected.options.alt + '</div>');

            if(!(localStorage.epoAltText == 'on')){
//               altTextContainer.hide();
                altTextContainer.addClass('alt-text-hidden');
            }
            this._mainContainerElement.prepend(altTextContainer);

            if(portal_instance.readerApiModes.debug){
                require('modules/core/WomiManager').womiEventBus.on('toggleWOMIAltText', function () {
                    _this._menuContainer.find('li > .alttext').toggle();
                    altTextContainer.toggleClass('alt-text-hidden');

                });
            }

            return {
                name: 'alttext',
                callback: function(){
                    _this._fancyBoxPattern('<div>' + _this.selected.options.alt + '</div>')
                }
            }
        },

        _disabledAlternativeItem: function() {
            var _this = this;

            return {
                name: 'disabledAlt',
                callback: function() {
                    Registry.get('layout').trigger('openAlttextTooltip', $('body'), '#' + _this._mainContainerElement.attr('data-disabled-alternative'));
                }
            }
        },

        _generateMenu: function () {
            if (Registry.get('contextMenu') == false) {
                return;
            }
            var womiMenu = new WOMIMenuLayout();

            var licItem = this._licenseItem();
            HookManager.executeHook('licenseItemAddingHook', [this._mainContainerElement, licItem], _.bind(function(){
                licItem && (this.menuItems = [licItem].concat(this.menuItems));
            }, this));

            womiMenu.addMenuItem(this._altTextItem());

            if (this._mainContainerElement.attr('data-disabled-alternative')) {
                womiMenu.addMenuItem(this._disabledAlternativeItem());
            }

            this.menuItems.forEach(function (entry) {
                womiMenu.addMenuItem(entry);
            });
            this._menuContainer = womiMenu.getMenu();
            //this._mainContainerElement.append(this._menuContainer);
            this.classic.object.postProcessMenu(this._menuContainer);

            return this._menuContainer;
        }
    });

    return WOMIContainer;
});