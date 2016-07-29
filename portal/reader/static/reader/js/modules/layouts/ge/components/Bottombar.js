define(['modules/layouts/default/components/Bottombar'], function (Bottombar) {
    return Bottombar.extend({
        load: function () {
            Bottombar.prototype.load.call(this);
            this.lock = 0;
            var _this = this;
            this.listenTo(this._layout, 'navHideDisplay', function () {
                _this.$el.hide();
            });
            this.listenTo(this._layout, 'navShowDisplay', function () {
                _this.$el.show();
            });

            this.listenTo(this._layout, 'space2dMoveStart', function (moduleElement) {
                _this.$el.hide();
            });

            this.listenTo(this._layout, 'space2dMoveEnd', function (moduleElement) {
                _this.$el.show();
            });
        },

        updateNavigationButtons: function (current, size) {
            var li = $(this.modules[current]).closest('li');
            var ul = li.closest('ul');
            size = ul.find('li').length;
            current = ul.find('li').index(li);
//            Bottombar.prototype.updateNavigationButtons.call(this, current, size);
            if (current + 1 >= size || size <= 1) {
                Bottombar.prototype.hideNavigationNext.call(this);
            } else {
                Bottombar.prototype.showNavigationNext.call(this);
            }
            if (current - 1 < 0 || size <= 1) {
                Bottombar.prototype.hideNavigationPrev.call(this);
            } else {
                Bottombar.prototype.showNavigationPrev.call(this);
            }
            if(size - 1 == current){
                this.lock = 1;
            }else if(current == 0){
                this.lock = -1;
            }else{
                this.lock = 0;
            }
        },

        goToPrevOrNextModule: function(offest){
            //console.log(offest, this.lock);
            if(this.lock && (offest == this.lock)){
                //pass
            }else{
                if(navigator.userAgent.match(/Trident/)) {
                   $('.table-of-contents-ge').height(0);
                }
                return Bottombar.prototype.goToPrevOrNextModule.call(this, offest);
            }
        }



    })
});
