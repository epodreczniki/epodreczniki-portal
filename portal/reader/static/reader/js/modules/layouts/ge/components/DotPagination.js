define(['jquery',
    'backbone',
    '../../Component',
    'underscore',
    'domReady',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/core/WomiManager',
    'layout'], function ($, Backbone, Component, _, domReady, Logger, Utils, womi, layout) {

    return Component.extend({
        name: 'DotPagination',
//        elementSelector: '[data-component="bottombar"]',
        elementSelector: '[data-component="dot-pagination"]',

        load: function () {
            var _this = this;
            this.aggresiveClickingLock = false;
            this.listenTo(this._layout, 'space2dMoveStart', function (moduleElement) {
                _this.aggresiveClickingLock = true;
                _this.registerChangedModule(moduleElement);
            });

            this.listenTo(this._layout, 'space2dMoveEnd', function (moduleElement) {
                _this.aggresiveClickingLock = false;
            });

            this.listenToOnce(this._layout, 'moduleLoaded', function (state) {
                _this.registerChangedModule($(state.moduleElement));
            });

            this.listenTo(this._layout, 'navHideDisplay', function(){
                _this.$el.hide();
            });
            this.listenTo(this._layout, 'navShowDisplay', function(){
                _this.$el.show();
            });
        },

        registerChangedModule: function (moduleEl) {
            var _this = this;
            if (!this.coll || moduleEl.data('collection-order-id') != this.coll) {
                this.coll = moduleEl.data('collection-order-id');
                var size = moduleEl.closest('ul').find('li').length;
                var ul = this.$el.find('ul');
                ul.html('');
                this.dots = [];
                for (var i = 0; i < size; i++) {
                    var li = $('<li>');
                    var dot = $('<button class="dot-icon" title="Moduł ' + (i + 1) + '">');
                    li.append(dot);
                    ul.append(li);
                    this.dots.push(dot);
                    dot.data('i', i);
                    dot.click(function(){
                        !_this.aggresiveClickingLock && _this.trigger('goToPrevOrNextModule', $(this).data('i') - _this.current);
                    });
                }
            }
            this.current = (moduleEl.data('module-order') - 1);
            _.each(this.dots, function(dot, index){
                dot[(_this.current == index ? 'addClass': 'removeClass')]('active');
            });


        }


    });

});