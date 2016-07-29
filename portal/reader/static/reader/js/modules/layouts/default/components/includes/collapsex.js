define(['jquery'], function($){
    'use strict';

    $.fn.collapsex = function (option) {
        return this.each(function () {
            var $this = $(this);

            var collapsed = !$this.hasClass('in-x');
            var opt = option;

            if (opt == 'toggle') {
                opt = (collapsed ? 'show' : 'hide');
            }

            if (opt == 'show' && collapsed) {
                $this.slideDown(200);
                $this.addClass('in-x');
            }

            if (opt == 'hide' && !collapsed) {
                $this.slideUp(200);
                $this.removeClass('in-x');
            }

            var a = $($this.prev());
            a[collapsed ? 'removeClass' : 'addClass']('collapsed');
        });
    };

    return {
        ready: function () {
            var collapsibleElements = $('[data-toggle=collapse-x]');

            collapsibleElements.each(function () {
                var target = $($(this).attr('data-target'));
                target.slideUp(0);
            });

            collapsibleElements.on('click', function (e) {
                var target = $($(this).attr('data-target'));
                target.collapsex('toggle');
            });

            $('.module-a').each(function (index, element) {
                if ($(element).data('module-id') == $('#module-base').data('module-id')) {
                    var moduleElement = element;

                    $('.collapse-x').each(function (index, element1) {
                        var found = false;

                        if ($(element1).has(moduleElement).length) {
                            found = true;
                        }

                        if ($(element1).attr('id') != 'index-menu') {
                            if (found && !$(element1).hasClass('in-x')) {
                                $(element1).collapsex('show');
                            }
                        }
                    });
                }
            });
        }
    };

});
