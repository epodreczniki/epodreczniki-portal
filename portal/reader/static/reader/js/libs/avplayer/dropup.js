/* ========================================================================
 * Based on Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ======================================================================== */

define(['jquery'], function (jQuery) {
    (function ($) {
        'use strict';

        // DROPUP CLASS DEFINITION
        // =========================

        var backdrop = '.dropdown-backdrop'
        var toggle = '[data-toggle=dropup]'
        var Dropdup = function (element) {
            $(element).on('click.bs.dropdup', this.toggle)
        }

        Dropdup.prototype.toggle = function (e) {
            var $this = $(this)

            if ($this.is('.disabled, :disabled')) return

            var $parent = getParent($this)
            var isActive = $parent.hasClass('open')

            if ($this.next().hasClass('sub-menu')) {

                var current = $this.next();

                if ($this.hasClass('trigger')) {
                    var grandparent = $this.parent().parent();
                    if ($this.hasClass('left-caret') || $this.hasClass('right-caret'))
                        $this.toggleClass('right-caret left-caret');
                    grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
                    grandparent.find(".open").not($parent).removeClass('open');
                    $parent.toggleClass('open');
                    e.stopPropagation();
                }
                else {
                    var root = $this.closest('.dropdown');
                    root.find('.left-caret').toggleClass('right-caret left-caret');
                    root.find('.sub-menu').removeClass('open');
                }
                return true;
            }
            else {

                clearMenus()

                if (!isActive) {
                    if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                        // if mobile we use a backdrop because click events don't delegate
                        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
                    }

                    var relatedTarget = { relatedTarget: this }
                    $parent.trigger(e = $.Event('show.bs.dropdup', relatedTarget))

                    if (e.isDefaultPrevented()) return

                    $parent
                        .toggleClass('open')
                        .trigger('shown.bs.dropdup', relatedTarget)

                    $this.focus()
                }

                return false
            }
        }

        Dropdup.prototype.keydown = function (e) {
            if (!/(38|40|27)/.test(e.keyCode)) return

            var $this = $(this)

            e.preventDefault()
            e.stopPropagation()

            if ($this.is('.disabled, :disabled')) return

            var $parent = getParent($this)
            var isActive = $parent.hasClass('open')

            if (!isActive || (isActive && e.keyCode == 27)) {
                if (e.which == 27) $parent.find(toggle).focus()
                return $this.click()
            }

            var desc = ' li:not(.divider):visible a'
            var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

            if (!$items.length) return

            var index = $items.index($items.filter(':focus'))

            if (e.keyCode == 38 && index > 0) index--                        // up
            if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
            if (!~index) index = 0

            $items.eq(index).focus()
        }

        function clearMenus(e) {
            $(backdrop).remove()
            $(toggle).each(function () {
                var $parent = getParent($(this))
                var relatedTarget = { relatedTarget: this }
                if (!$parent.hasClass('open')) return
                $parent.trigger(e = $.Event('hide.bs.dropdup', relatedTarget))
                if (e.isDefaultPrevented()) return
                $parent.find('.left-caret').toggleClass('right-caret left-caret');
                $parent.find('.sub-menu').removeClass('open');
                $parent.removeClass('open').trigger('hidden.bs.dropdup', relatedTarget)
            })
        }

        function getParent($this) {
            var selector = $this.attr('data-target')

            if (!selector) {
                selector = $this.attr('href')
                selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
            }

            var $parent = selector && $(selector)

            return $parent && $parent.length ? $parent : $this.parent()
        }


        // DROPUP PLUGIN DEFINITION
        // ==========================

        var old = $.fn.dropup

        $.fn.dropup = function (option) {
            return this.each(function () {
                var $this = $(this)
                var data = $this.data('bs.dropdup')

                if (!data) $this.data('bs.dropdup', (data = new Dropdup(this)))
                if (typeof option == 'string') data[option].call($this)
            })
        }

        $.fn.dropup.Constructor = Dropdup


        // DROPUP NO CONFLICT
        // ====================

        $.fn.dropup.noConflict = function () {
            $.fn.dropup = old
            return this
        }


        // APPLY TO STANDARD DROPUP ELEMENTS
        // ===================================

        $(document)
            .on('click.bs.dropdup.data-api', clearMenus)
            .on('click.bs.dropdup.data-api', '.dropdown form', function (e) {
                e.stopPropagation()
            })
            .on('click.bs.dropdup.data-api', toggle, Dropdup.prototype.toggle)
            .on('keydown.bs.dropdup.data-api', toggle + ', [role=menu], [role=listbox]', Dropdup.prototype.keydown)

    })(jQuery);
});
