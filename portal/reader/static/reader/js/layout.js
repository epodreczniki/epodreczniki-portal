define(['jquery', 'underscore'], function ($, _) {
    'use strict';

    var fullScreenBreakpoint = 767;
    var contentWidth = $('#module-content').width();

    function fullScreenMode() {
        return $(window).width() > fullScreenBreakpoint;
    }

    function WOMIMenuLayout() {
        this.init();
    }

    $.extend(WOMIMenuLayout.prototype, {
            init: function () {
                this._menu = $('<ul />');
                this._womiMenu = $('<div />', {
                    'class': 'womi-menu'
                });
                this._womiMenu.append(this._menu);
            },

            getMenu: function () {
                return this._womiMenu;
            },

            addMenuItem: function (item) {
                var validList = ['license', 'reset', 'fullscreen', 'play', 'stop', 'pause', 'prev', 'next', 'zoomin', 'zoomout'];
                if (_.find(validList, function (n) {
                    return n == item.name
                }) === undefined) {
                    return;
                }

                var itemTitles = {
                    'fullscreen': 'Widok pełnoekranowy',
                    //'play': 'Graj',
                    'reset': 'Resetuj widok',
                    'play': 'Odtwórz/Wstrzymaj',
                    'classic': 'Wersja klasyczna',
                    'mobile': 'Wersja mobilna',
                    'classic3d': 'Wersja klasyczna (3D)',
                    'classic2d': 'Wersja klasyczna (2D)',
                    'stop': 'Zatrzymaj',
                    'pause': 'Odtwórz/Wstrzymaj',
                    'next': 'Następny',
                    'prev': 'Poprzedni',
                    'zoomin': 'Przybliż',
                    'zoomout': 'Oddal',
                    'license': 'Licencja'
                };
                //var li = $('<li />', {style: 'display: none;'});
                var li = $('<li />');
                var itemA = $('<button />', {
                    'class': item.name.replace(' ', '') + ' hastip',
                    'title': itemTitles[item.name]
                });
                itemA.append('<span class="wcag-hidden-inside">' + itemTitles[item.name] + '</span>');
                if(item.name == 'license' && (localStorage.epoLicenseOn == 'false' || !localStorage.epoLicenseOn)){
                    itemA.hide();
                }
                if (!Modernizr.touch) {
                    itemA.tooltipsy({
                        alignTo: 'element',
                        offset: [-1, 1]
                    });
                }
                itemA.click(function () {
                    return item.callback(this);
                });
                li.append(itemA);

                this._menu.append(li);
            },

            setItemCallback: function (name, callback) {
                this._menu.find('li .' + name).click(function () {
                    return callback();
                });
            },

            showMenuItem: function (name) {
                this._menu.find('li .' + name).show();
            },

            hideMenuItem: function (name) {
                this._menu.find('li .' + name).hide();
            }

        }
    );

    function tableLayoutCheck() {
    	if(fullScreenMode()){
        	$('div.table').find('table').css('table-layout', 'fixed');
        }else{
        	$('div.table').find('table').css('table-layout', 'auto');
        }
    }

    $(document).ready(function () {
    	tableLayoutCheck();
    });

    $(window).resize(function () {
        tableLayoutCheck();
    });

    return {
        fullScreenMode: fullScreenMode,
        WOMIMenuLayout: WOMIMenuLayout
    };

});
