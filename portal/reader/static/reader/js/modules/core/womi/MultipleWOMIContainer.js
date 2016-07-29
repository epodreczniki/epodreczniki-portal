define(['jquery', 'backbone', 'modules/core/Registry', './WOMIContainerBase'], function ($, Backbone, Registry, Base) {
    return Base.extend({
        DISPLAY_MODES: {
            '2d': 'primaryElement',
            '3d-anaglyph': 'secondaryElement'
        },
        _lookForBlocks: function () {
            var _this = this;
            $(this._mainContainerElement).each(function (index, element) {
                _this[_this.DISPLAY_MODES[$(element).data('display-mode')]] = element;
            });
            this._selectedElement = this.primaryElement;
        },
        _discoverContent: function () {
            var div = this.primaryElement;
            this.primaryElement.womiObj = new this.CLASS_MAPPINGS[div.className](div);
            div = this.secondaryElement;
            this.secondaryElement.womiObj = new this.CLASS_MAPPINGS[div.className](div);
        },
        dispose: function () {
            this._selectedElement.womiObj.dispose();
            //this.switcher.dispose();
        },
        switchToPrimary: function () {
            this._selectedElement.womiObj.dispose();
            this._selectedElement = this.primaryElement;
            this._selectedElement.womiObj.load();
        },
        switchToSecondary: function () {
            this._selectedElement.womiObj.dispose();
            this._selectedElement = this.secondaryElement;
            this._selectedElement.womiObj.load();
        },
        load: function () {
            this._selectedElement.womiObj.load();
        },
        getFSElement: function () {
            return this._selectedElement.womiObj.getFSElement();
        },
        getMenuItems: function () {
            var _this = this;
            return [
                {
                    name: '2d',
                    callback: function () {
                        _this.switchToPrimary();
                    }
                },
                {
                    name: '3d',
                    callback: function () {
                        _this.switchToSecondary();
                    }
                }
            ]
        }

    });
});