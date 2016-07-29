define(['jquery', 'endpoint_tools'], function ($, endpoint_tools) {

    return {
        collectTilesDummies: function (parent) {
            var listOfDummies = [];
            // CAUTION: import of attribute "tile-layout" was broken for a quite some time
            // if it is needed back in already imported collections, reimport operation is necessary
            // contact psnieg
//            var toc = $('#table-of-contents');
//            $(toc).find('[data-attribute-panorama-order][data-toc-parent-path=' + parent.attr('data-toc-path') + ']').each(function () {
//                listOfDummies.push(JSON.parse($(this).attr('data-attribute-tile-layout').replace(/\'/g, '"')));
//            });
            return listOfDummies;
        },
        getMainContentPlaceholder: function () {
            return this._contentPlaceholder;
        },
        setMainContentPlaceholder: function (placeholder) {
            if (!this._contentPlaceholder) {
                this._contentPlaceholder = placeholder;
            }
        },
        makeLinksAbsolute: function (windowHref, nodeToSearch) {
            // Remove anchor first from current window URL
            var anchorIdx = windowHref.lastIndexOf('#');
            if (anchorIdx != -1) {
                windowHref = windowHref.substr(0, anchorIdx);
            }

            $(nodeToSearch).find('a').each(function () {
                var href = $(this).attr('href');
                var t = $(this);
                if (!href) {
                    return;
                }

                // Do not touch absolute links
                if (href.startsWith('//') || href.startsWith('http')) {
                    return;
                }
                if (href.startsWith('..')) {
                    var moduleUrlPattern = $('#module-base').data('module-url-pattern');
                    if (t[0].hasAttribute('data-collection-id') && moduleUrlPattern) {
                        t.attr('href', endpoint_tools.replaceUrlArgs(moduleUrlPattern, {
                            collection_id: t.data('collection-id'),
                            variant: t.data('collection-recipient'),
                            version: t.data('collection-version'),
                            module_id: href.split('../')[1]
                        }));
                        return;
                    }
                    if (windowHref.lastIndexOf('/') != windowHref.length - 1) {
                        $(this).attr('href', windowHref + '/' + href);
                        return;
                    }

                }
                $(this).attr('href', windowHref + href);
            });
        },

        checkIfTitle: function() {
            return /^\/reader\/c\/[^\/]+\/v\/[^\/]+\/t\/[^\/]+[^\/]$/.test($(location).attr('pathname'));
        },

        refreshContactFormUrl: function(){
            var href = this._windowHref();
            if(this.checkIfTitle()){
                href += '/m/title'
            }
            $('#contact-form-data').data('contact-form-absolute-path', href + '/contact');
        },

        _windowHref: function(){
          var windowHref = window.location.href;
            var anchorIdx = windowHref.lastIndexOf('#');
            if (anchorIdx != -1) {
                windowHref = windowHref.substr(0, anchorIdx);
            }
            return windowHref;
        },

        fullHrefToCurrentModule: function () {
            var href = window.location.href;
            return href;
        },

        stripHost: function (domain) {
            var pos = domain.indexOf('.');
            if (pos == -1) {
                return domain;
            } else {
                return domain.substr(pos + 1);
            }
        },

        getModuleTOCEntry: function() {
            var base = $('#module-base');
            var module_id = base.data('module-id');
            var module = $('#table-of-contents').find('.module-a[data-module-id="' + module_id + '"]')[0];
            return $(module);
        },

        setValidDomain: function () {
            if (navigator.userAgent.indexOf("MSIE") == -1) {
                if (document.domain != 'localhost') {
                    try {
                        document.domain = this.stripHost(document.domain);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        },
        activeClass: 'link-active'
    }

});
