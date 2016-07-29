define(['jquery',
    'backbone',
    '../../Component',
    'underscore',
    'domReady',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    '../GeUtils',
    'modules/core/WomiManager',
    'layout',
    'text!../templates/license.html'], function ($, Backbone, Component, _, domReady, Logger, Utils, GeUtils, womi, layout, LicenseTemplate) {

    return Component.extend({
        name: 'Topbar',
        elementSelector: '[data-component="topbar"]',

        events: {
            "click .toggle-topbar": "toggleTopbar",
            "click .toggle-button": "toggleElement",
            "click #licences-btn": "getLicense",
            "click #cc": "getCc"
        },

        load: function () {
            this.topbarVisible = false;
            var _this = this;

            this.listenTo(this._layout, 'moduleLoaded', function (state) {

                _this.generateTasksList($(state.moduleElement));

                _this.showProperTabs($(state.moduleElement));

                this.setTabsHeight();

            });

            this.listenTo(this._layout, 'windowResize', function () {
                
                this.setTabsHeight();

            });

            this.listenTo(this._layout, 'navHideDisplay', function () {
                _this.$el.hide();
            });

            this.listenTo(this._layout, 'navShowDisplay', function () {
                _this.$el.show();
            });

            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
                $('.dropdown-menu').css('margin-top', '1px');
            }

        },

        generateTasksList: function (moduleEl) {

            var _this = this;

            if (!this.coll || moduleEl.data('collection-order-id') != this.coll) {
                this.coll = moduleEl.data('collection-order-id');

                var moduleParents = GeUtils.getParentsOfModule(moduleEl);

                var size = moduleEl.closest('ul').find('a').length;
                var modulesArray = moduleEl.closest('ul').find('a');
                var ul = this.$el.find('.exercise-list-content');
                ul.html('');

                var classNum = $('#module-base').data('collection-class');

                var headerClass = $('<p>Klasa ' + classNum + '</p>');

                var headerOne = $('<p>', {
                    //html: "Blok " + $(moduleParents[0]).data('toc-path').split('_')[1] + ". " + $(moduleParents[0]).text()
                    html: _.unescape($(moduleParents[0]).html())
                });

                var headerTwo = $('<p>', {
                   //html: "Temat " + $(moduleParents[1]).data('toc-path').split('_')[2] + ". " + $(moduleParents[1]).text()
                    html: _.unescape($(moduleParents[1]).html())
                });

                ul.append([headerClass, headerOne, headerTwo]);

                this.dots = [];

                for (var i = 0; i < size; i++) {
                    var li = $('<li>');
                    var span = $('<span>');
                    var dot = $('<a class="title" tabindex="0"></a>');
                    dot.html(_.unescape($(modulesArray[i]).html()));


                    span.append(dot);
                    li.append(span);
                    ul.append(li);
                    this.dots.push(dot);
                    dot.data('i', i);
                    dot.click(function () {
                        _this.trigger('goToPrevOrNextModule', $(this).data('i') - _this.current);
                        $('.toggle-button.active').trigger('click'); //hide modules list
                    });
                    dot.keyup(function(event) {
                        if (event.keyCode == 13) $(this).click();
                    });
                    var ws = $(modulesArray[i]).data('attribute-ee-external-work-sheet');
                    if (ws) {
                        var womiIds = (ws + '').split(",");
                        
                        _.each(womiIds, function(womiId) {
                            var liPrint = $('<li>', {
                                'class': 'print-card-module'
                            });
                            $(span).append(liPrint);
                            this.getWomiUrl(womiId, this.addPrintCardLink, liPrint);
                        }, this);

                    };

                }
            }

            this.current = (moduleEl.data('module-order') - 1);
            _.each(this.dots, function (dot, index) {
                dot[(_this.current == index ? 'addClass' : 'removeClass')]('active');
            });

        },

        getWomiUrl: function(womiId, cb, dest) {

            var url = '/content/womi/' + womiId; 

            require(['text!' + url + '/manifest.json', 'text!' + url + '/metadata.json'], function(manifest, metadata) {
                url += '/' + JSON.parse(manifest)['mainFile'];
                var title = JSON.parse(metadata)['title'];
                cb(dest, url, title);
            });

        },

        addPrintCardLink: function(dest, url, title) {

            dest.append($('<span>', {
                'class': 'print-card-title',
                'text': title 
            }));

            dest.append($('<a>', {
                'href': url,
                'class': 'module-print-card-link',
                'target': '_blank'
            }));

        },

        elemShow: function (elem, btn, contactBtn) {

            elem.show();
            elem.removeClass('topbar-ge-inner-hidden', 400);
            btn.removeClass('toggle-topbar-up', 400);
            contactBtn.removeClass('contact-form-trigger-up', 400);

            this.topbarVisible = true;

            this._layout.components.toc.hideSidebar();

        },

        elemHide: function (elem, btn, contactBtn) {

            if (this.topbarVisible) {
                elem.addClass('topbar-ge-inner-hidden', {duration: 400, complete: function() {elem.hide();}});
                btn.addClass('toggle-topbar-up', 400);
                contactBtn.addClass('contact-form-trigger-up', 400);

                $('.dropdown-content').hide();
                $('.toggle-button').removeClass('active');

                this.topbarVisible = false;
            }

        },


        setTabsHeight: function() {
        
            var winHeight = $(window).height(),
                topbarHeight = this.$el.children('.topbar-ge-inner').height();

            $('ul.dropdown-content').css('maxHeight', winHeight - topbarHeight - (0.2 * topbarHeight));

        },

        toggleTopbar: function (e) {

            e.preventDefault();

            this.changeElemState();

        },

        changeElemState: function (param) {

            var elem = $('.topbar-ge-inner'),
                btn = $('.toggle-topbar'),
                contactBtn = $('.contact-form-trigger'),
                param = param || 'toggle';

            if (param === 'toggle') {

                if (this.topbarVisible) {
                    this.elemHide(elem, btn, contactBtn);
                } else {
                    this.elemShow(elem, btn, contactBtn);
                }

            } else {
                this['elem' + param](elem, btn, contactBtn);
            }


        },

        toggleElement: function (ev) {
            var source = $(ev.target),
                elem = source.next();

            if (elem.is(':visible')) {
                source.removeClass('active');
                elem.slideUp();
            } else {
                $('.dropdown-content').slideUp('fast');
                $('.toggle-button').removeClass('active');
                source.addClass('active');
                elem.slideDown();
            }

        },

        showProperTabs: function (moduleElement) {

            var tasksList = $('#exercise-list'),
                supplementaryTasksList = $('#supplementary-tasks'),
                supplementaryTasksData = $("div[data-role='polecenie-uzupelniajace']");

            $('.core-curriculum-content').html('');

            if (GeUtils.isModuleFirstOrLast(moduleElement)) {

                tasksList.show()

                supplementaryTasksList.hide();

            } else {

                tasksList.hide();

                if (supplementaryTasksData.length > 0) {

                    supplementaryTasksList.show();

                    supplementaryTasksList.children('ul')
                        .html('')
                        .append(supplementaryTasksData.find('ul'));

                    supplementaryTasksData.remove();

                } else {

                    supplementaryTasksList.hide();

                }

            }

        },

        SHOW_LICENSE_WOMI: '<span class="icon"></span>Pokaż szczegóły licencji',
        HIDE_LICENSE_WOMI: '<span class="icon"></span>Ukryj szczegóły licencji',

        getLicense: function () {
            var lc = $('#licenses-content');
            var hasLic = (localStorage.epoLicenseOn == 'false' || !localStorage.epoLicenseOn);
            lc.html(_.template(LicenseTemplate, {hasLic: hasLic}));
            var _this = this;

            lc.find('.copyright > a').click(function () {
                localStorage.epoLicenseOn = (localStorage.epoLicenseOn == 'on' ? 'false' : 'on');
                _this.trigger('toggleWOMILicense');

                if (hasLic) {
                    $(this).html(_this.HIDE_LICENSE_WOMI);
                }else{
                    $(this).html(_this.SHOW_LICENSE_WOMI);
                }

                 $('.toggle-topbar').trigger('click');

                hasLic = !hasLic;
                return false;
            });

        },

        getCc: function () {

            this.getMetadata('curriculum', $('.core-curriculum-content'));

        },

        getMetadata: function (type, target) {

            var loadingDiv = $("<div>", { "class" : "loading-image" });
			target.append( loadingDiv );

            var href = $('#index-menu').find('.link-active').attr('data-module-' + type + '-url');

            $.ajax({
                url: href
            }).done(function (html) {
                target.html(html);
            });

        },

        setBreadcrumbs: function (elem) {

            var parentid = elem.data('toc-parent-path');

            var parent = $("#index-menu").find("[data-toc-path='" + elem.data('toc-parent-path') + "']");

            $("#breadcrumb-1").attr('style', parent.attr('style'));

            $("#breadcrumb-2").attr('style', elem.attr('style'));

        }

    })
});

