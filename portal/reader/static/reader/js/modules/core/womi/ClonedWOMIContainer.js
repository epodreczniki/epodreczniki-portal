define(['jquery', 'backbone', 'modules/core/Registry', './WOMIContainer'], function ($, Backbone, Registry, WOMIContainer) {
    return WOMIContainer.extend({

        init: function (element) {

            this._mainContainerElement = $(element);
            this._mainContainerElement.css('margin', 0);
            this._mainContainerElement.children().each(function (index, element) {
                var el = $(element);
                if (!(el.hasClass('classic') || el.hasClass('mobile'))) {
                    el.remove();
                }
            });
            this.menuItems = [];
            this._lookForBlocks();
            this._discoverContent();
        },
        _fullscreenMenuItem: function () {
            return null;
        },
        loadCurrent: function (itemName) {
            this.menuItems.forEach(function (entry) {
                if (entry.name == itemName) {
                    entry.callback();
                }
            })
        }
    });
});