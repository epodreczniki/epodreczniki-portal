define(['backbone'], function (Backbone) {

    return Backbone.View.extend({
            initialize: function () {
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
                var validList = [/*'alttext', */'license', 'reset', 'fullscreen', 'play', 'stop', 'pause', 'prev', 'next', 'zoomin', 'zoomout', 'disabledAlt'];
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
                    'license': 'Licencja',
                    'alttext': 'Pokaż tekst alternatywny',
                    'disabledAlt': 'Alternatywny opis'
                };
                //var li = $('<li />', {style: 'display: none;'});
                var li = $('<li />');
                var itemA = $('<button />', {
                    'class': item.name.replace(' ', '') + ' hastip',
                    'title': itemTitles[item.name]
                });
                itemA.append('<span class="wcag-hidden-inside">' + itemTitles[item.name] + '</span>');
                if (item.name == 'license' && (localStorage.epoLicenseOn == 'false' || !localStorage.epoLicenseOn)) {
                    itemA.hide();
                }

                if (item.name == 'alttext' && (localStorage.epoAltText == 'false' || !localStorage.epoAltText)) {
                    itemA.hide();
                }

                if (item.name == 'disabledAlt' && (localStorage.epoAltDescOn == 'false' || !localStorage.epoAltDescOn)) {
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
});