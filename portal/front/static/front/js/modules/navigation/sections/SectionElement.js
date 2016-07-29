define(['declare', 'jquery', './vars'], function (declare, $, vars) {
    return declare({
        instance: {

            constructor: function(node, parent){
                this.init(node, parent);
            },

            init: function (node, parent) {
                this.thisNode = $(node);
                this.parent = parent;
                this.clickReturn = false;
                this._initClick();
            },

            _initClick: function () {
                var _this = this;
                this.thisNode.click(function () {
                    var isActive = _this.hasActiveClass();
                    _this.parent.setSelected(_this, _this.getText());
                    if (isActive) {
                        return true;
                    }
                    return _this.clickReturn;
                });
            },

            getText: function () {
                return $.trim(this.thisNode.text());
            },

            toggle: function (showOrHide) {
                this.thisNode[showOrHide](vars.SPEED, vars.EFFECT);
            },
            attr: function (selector) {
                return this.thisNode.attr(selector);
            },
            hasActiveClass: function () {
                return this.thisNode.hasClass('active');
            },
            resetActiveClass: function () {
                this.thisNode.removeClass('active');
                this.thisNode.find('i').remove();
            },
            setActiveClass: function () {
                this.thisNode.addClass('active');
                this.thisNode.find('a').append(vars.ACTIVE_FILTER);
            }

        }
    });
});
