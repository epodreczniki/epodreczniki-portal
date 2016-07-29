define(['jquery', './ContentEngineInterface'], function($, ContentEngineInterface){
       function PostLoadProcesses() {
        this.init();
    }

    $.extend(PostLoadProcesses.prototype, {
        init: function () {
            this.endProcessHook();
        },
        initialized: false,

        _reprocess: function (className, inputSelector, toggles) {
            $(className).each(function (index, entry) {
                if (typeof toggles === 'undefined') {
                    toggles = false;
                }
                var _this = entry;
                var parent;
                if (toggles) {
                    parent = $(_this).prev();
                } else {
                    parent = $(_this).parent();
                }
                var input = parent.find(inputSelector);
                if (input.length > 0) {
                    input.click(function () {
                        setTimeout(function () {
                            if (typeof MathJax !== 'undefined') {
                                MathJax.Hub.Rerender(_this);
                            }
                            var els = $(_this).find('.womi-container');
                            els.trigger('resize', ['reprocess']);
                        }, 100);

                    });
                }
            });
        },

        _reprocessRoutines: function () {
            this._reprocess('div[class="feedback"]', 'input[type="button"]');
            this._reprocess('div[class="feedback"]', 'input[type="radio"]');
            this._reprocess('div[class="hint"]', 'input[type="button"]');
            //this._reprocess('.solution', 'a', true);
            //this._reprocess('.commentary', 'a', true);
            this._reprocess('.solution', 'input[type="button"]', true);
            this._reprocess('.commentary', 'input[type="button"]', true);

            $('.commentary-toggles').children().each(function(i, o) {
                $(o).attr('title', $(o).attr('value'));
            });
        },

        endProcessHook: function () {
            if (typeof MathJax !== 'undefined') {
                var _this = this;
                MathJax.Hub.Register.MessageHook("End Process", function () {
                    if (!_this.initialized) {
                        _this._reprocessRoutines();
                        _this.initialized = true;
                    }
                });
            } else {
                this._reprocessRoutines();
            }

        }

    });

    return ContentEngineInterface.extend({
        runOnTriggers: ['postload'],
        reload: function(placeholder, options){
            if(options.runOn) {
                new PostLoadProcesses();
            }
        }
    })
});