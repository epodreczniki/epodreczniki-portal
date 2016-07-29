define(['declare', 'jquery', './vars', './SectionElement'], function (declare, $, vars, SectionElement) {
    return declare(null, {
        instance: {
            constructor: function(sectionName){
              this.init(sectionName);
            },
            _getDataSelector: function (selector, id) {
                return "[" + selector + "='" + id + "']";
            },

            init: function (sectionName) {
                this._initVars();
                this.sectionName = sectionName;
                this.sectionNode = $(this._getDataSelector('data-section-id', sectionName));
                this.headNode = $(this._getDataSelector('data-section-header', sectionName));
                this.itemsNode = $(this._getDataSelector('data-section-items', sectionName));
                this._initSections();
                this._initClick();

            },
            _initVars: function () {
                this.collapsed = false;
                this.sections = [];
                this.headNode = null;
                this.sectionNode = null;
                this.itemsNode = null;
                this.sectionName = '';
                this.currentSection = '';
                this.clickReturn = false;
            },
            _initSections: function () {
                var _this = this;
                $(this.itemsNode.find('li')).each(function (index, value) {
                    var se = new SectionElement(value, _this);
                    se.clickReturn = _this.clickReturn;
                    _this.sections.push(se);
                    if (se.hasActiveClass()) {
                        _this.currentSection = se.getText();
                    }
                });
            },

            _initClick: function () {
                var _this = this;
                this.headNode.click(function () {
                    _this.toggle();
                    return false;
                });
            },

            _isActive: function () {
                return 'None' != this.headNode.data('active');
            },
            _setActive: function (text) {
                this.headNode.data('active', text);
            },
            _getActive: function () {
                return this.headNode.data('active');
            },
            _getDefault: function () {
                return this.headNode.data('default-text');
            },
            _setIcon: function (icon) {
                this._removeIcon();
                this.headNode.append(icon);
            },
            _removeIcon: function () {
                this.headNode.find('i').remove();
                //this.headNode.find('a').append(icon);
            },
            toggle: function () {

                if (this.collapsed) {
                    this.itemsNode.slideDown(vars.SPEED);
                    this.headNode.text(this._getDefault());
                    this._setIcon(vars.SLIDE_UP_ICON);
                    this.collapsed = false;
                    this.onOpen();
                } else {
                    //this._setIcon(SLIDE_DOWN_ICON);
                    this.onClose();

                    if (!this.hasSomethingActive()) {
                        this._removeIcon();
                        return;
                    }

                    this.itemsNode.slideUp(vars.SPEED);
                    this.collapsed = true;
                    this.headNode.text(this._getActive());
                    this._setIcon(vars.SLIDE_DOWN_ICON);
                }
            },

            show: function () {
                this.collapsed = true;
                this.toggle();
            },
            hide: function () {
                this.collapsed = false;
                this.toggle();
            },
            quickHide: function () {
                this.itemsNode.slideUp(0);
                this.collapsed = true;
                this.headNode.text(this._getActive());
                this._setIcon(vars.SLIDE_DOWN_ICON);
            },
            setSelected: function (sectionElement, text) {
                this.sections.forEach(function (value) {
                    value.resetActiveClass();
                });
                sectionElement.setActiveClass();
                this._setActive(text);
                this.headNode.text(text);

                this.onSelected(this, text);
                this.toggle();
            },
            onOpen: function () {
            },
            onClose: function () {
            },
            onSelected: function (obj, id) {
            },
            showSection: function () {
                this.sectionNode.slideDown(vars.SPEED);
                if (this.hasSomethingActive()) {
                    this.hide();
                    this._setIcon(vars.SLIDE_DOWN_ICON);
                } else {
                    this.show();
                    this._removeIcon();
                }
            },
            hideSection: function () {
                this.sectionNode.slideUp(vars.SPEED);
            },
            hasSomethingActive: function () {
                var hasActive = false;
                this.sections.forEach(function (value) {
                    if (value.hasActiveClass()) {
                        hasActive = true;
                    }
                });
                return hasActive;
            },
            hasPhoneWidth: function () {
                var w = $(window).width();
                return w <= 767;

            }

        }
    })
});
