define([
    'jquery',
    'backbone',
    'underscore',
    './Logger',
    './WomiManager',
    'layout',
    'modules/utils/ReaderUtils',
    'modules/core/HookManager',
    'modules/core/Performance',
    'EpoAuth',
    'modules/core/engines/content_engines/include',
    'modules/api/Utils'], function ($, Backbone, _, Logger, womi, layout, Utils, HookManager, Perf, Auth, engines_include, ApiUtils) {
    return Backbone.View.extend({

        logger: Logger,
        name: 'ReaderKernel',

        moduleStateParams: ['save', 'ajaxUrl', 'module_id', 'version', 'href', 'dependencies', 'click', 'moduleElement'],
        initialize: function (options) {
            options = options || {};
            this.options = options;
            this.logger.addLogger(this);
            this._launchInitProc = options.launchInitProc || true;
        },

        registerLayout: function (layout) {
            this._layout = layout;
            var _this = this;
            this.on('all', function () {
                _this._layout.trigger.apply(_this._layout, arguments);
            });
        },

        load: function () {

        },
        run: function () {
            var _this = this;
            this.trigger('kernelStart');
            var lazyLayout = _.debounce(function () {
                _this._layout.trigger('windowResize');
            }, 1);
            $(window).resize(lazyLayout);
            this._supplementEvents();

            this.on('loadModule', function (state) {
                _this.loadModule(state.save, state.ajaxUrl, state.module_id, state.version, state.href, state.dependencies, state.click);
            });

            this._layout.on('windowResize', function () {
                womi.resizeAll();
            });

            this.on('moduleSpawned', function () {
                var t = window.performance.timing;

            });

            Auth.connectEventObject(this);

            this.on('positiveLogin', function(status){
                Logger.log('logged in as: ' + status.user, this);
            });

            var base = $('#module-base');
            if(base.data('register-collection') == 'yes') {
                this.once('positiveLogin', function (status) {
                    if (status.endpoints.last_collections) {

                        var ra = (new ApiUtils.ReaderInfoProvider()).thisPageIdentifiers();
                        var handbook_id = ApiUtils.handbookIDGenerator(ra.collectionId, ra.collectionVersion, ra.collectionVariant);
                        var link = ApiUtils.buildUrl(status.endpoints.last_collections.put_viewed, {handbook_id: handbook_id});

                        Auth.apiRequest('put', link, JSON.stringify({update: true}), function () {
                        });
                    }
                });
            }

            Auth.connectToPage($('#topbar').find('.epo-auth-hook'));

            engines_include.registerOnLoadEngines();

            this.on('moduleLoaded', function (state) {
                var target = _this._layout.components.grid.contentPlaceholder();
                Utils.makeLinksAbsolute(state.href, target);
                Utils.refreshContactFormUrl();
                _this.trigger('moduleSpawned');
                // ET-1411 BEGIN
                // _this.trigger('gridClicked');
                var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth;
                if (x < 776) {
                    _this.trigger('gridClicked');
                }
                // ET-1411 END

                _this.loadModuleDependencies(state.dependencies);
                engines_include.fireOnLoadEngines(target, {});
                Auth.ping();
            });
            Perf.startPerformance();
            this._layout.build();

            if (this._launchInitProc) {
                this._initHistory();
                this._loadModuleJQueryExt();
            }
        },

        _supplementEvents: function(){
            this.listenTo(this._layout, 'toggleWOMILicense', function () {
                womi.womiEventBus.trigger('toggleWOMILicense');
            });
            this.listenTo(this._layout, 'toggleWOMIAltText', function () {
                womi.womiEventBus.trigger('toggleWOMIAltText');
            });
        },

        _initHistory: function () {
            var _this = this;
            var modules = $('.module-a');
            var base = $('#module-base');
            var params = ['save', 'ajaxUrl', 'module_id', 'version', 'href', 'dependencies', 'click', 'moduleElement'];
            window.onpopstate = function (event) {
                if (event.state != null) {
                    var state = event.state;
                    //setActiveClass(modules, $('a[data-module-id=' + state.module_id + ']'));
                    // TODO: EPP-1438 take version into consideration here
                    //commonRefreshFunctions($('a[data-module-id=' + state.module_id + ']'));
                    var mod = $('a[data-module-id="' + state.module_id + '"]');
                    //_this.trigger('loadModule', _.extend({save: false, click: true}, state));
                    HookManager.executeHook('loadModuleHook', [_this, mod, true, false], _.bind(function () {
                        _this.trigger('loadModule', _.extend({save: false, click: true}, state));

                    }));
                }
            };
            var firstState = {
                ajaxUrl: base.data('ajax-url'),
                module_id: base.data('module-id'),
                href: Utils.fullHrefToCurrentModule(),
                dependencies: base.data('dependencies-url')
            };
            if (Utils.getMainContentPlaceholder()) {
                Utils.getMainContentPlaceholder().children('div').first().addClass('stop-loading-animation');
            }
            window.history.replaceState(firstState, null, Utils.fullHrefToCurrentModule());

        },

        loadModule: function (saveState, ajaxUrl, module_id, module_version, href, dependencies, fromClick) {
            var url = ajaxUrl;
            var _this = this;
            var target = Utils.getMainContentPlaceholder();
            var base = $('#module-base');
            //var tiles = require('modules/womi_tiles');

            womi.disposeAll();
            var module = $('a[data-module-id=' + module_id + ']');
            var params = _.object(_this.moduleStateParams, [saveState, ajaxUrl, module_id, module_version, href, dependencies, fromClick, module]);

            this.trigger('moduleLoadingStart', params);
            Perf.startPerformance();
            $.get(url, function (data) {
                var contentNode = target;

                contentNode.on('animationstart webkitAnimationStart MSAnimationStart', function(event) {
                    if (event.originalEvent.animationName == 'nodeInserted') {
                        //Utils.makeLinksAbsolute(href, target);
                        window.scrollTo(0, 0);

                        _this.setTitle(module);

                        base.attr('data-module-id', module_id);
                        _this.trigger('moduleLoaded', params);
                    }
                    contentNode.off('animationstart webkitAnimationStart MSAnimationStart');
                });

                contentNode.on('animationend webkitAnimationEnd MSAnimationEnd', function(event) {
                    if (event.originalEvent.animationName == 'nodeInserted') {
                        $(target).removeClass('loading');
                        $(target).children('div').first().addClass('stop-loading-animation');
                        _this.trigger('moduleLoadingEnd', params);
                    }
                    contentNode.off('animationend webkitAnimationEnd MSAnimationEnd');
                });

                $(target).addClass('loading');
                $(target).html(data);

                if (saveState) {
                    window.history.pushState({ajaxUrl: url,
                        module_id: module_id, href: href, dependencies: dependencies}, null, href);
                }
            });

            return false;
        },

        setTitle: function (moduleElement) {
            var titlePattern = $('base').data('title-pattern');
            var pattern = /[\d\.]*[ ]*(.+)/;
            var moduleTitle = $(moduleElement).attr('data-raw-title').match(pattern)[1];
            $('title').text(titlePattern.format(moduleTitle));
        },

        _connectClass: function(clazz){

            var cls = new clazz();

            this._layout.on('refreshContent', function(placeholder, options){
                cls.reload(placeholder, options);
            });
        },

        loadModuleDependencies: function (url) {
            var chainOfCalls = [];
            var _this = this;
            this._layout.off('refreshContent');
            $.get(url, function (_engines) {
                $.each(_engines, function (index, object) {
                    var call = {
                        calle: object.after_load_call,
                        url_template: object.url_template,
                        clazz: object.class_name,
                        ready: false,
                        name: object.name
                    };
                    chainOfCalls.push(call);
                });
                chainOfCalls.push({calle: function () {
                    engines_include.runOn(null, {runOn: 'postload'});
                }, ready: true});
                chainOfCalls.forEach(function (object) {
                    if (object.url_template) {
                        require([object.url_template], function (lib) {
                            try {
                                if (object.clazz && object.clazz !== '') {
                                    require([object.clazz], function(clazz){
                                        _this._connectClass(clazz);
                                    });
                                } else {
                                    if (typeof object.calle !== 'string') {
                                        object.calle();
                                    } else {
                                        eval(object.calle);
                                    }
                                }
                            } catch (err) {
                                Logger.log(err, object, true);
                            }
                        });
                    } else {
                        object.calle();
                    }
                });
            });
        },

        _loadModuleJQueryExt: function () {
            var kernel = this;
            var params = ['save', 'ajaxUrl', 'module_id', 'version', 'href', 'dependencies', 'click', 'moduleElement'];
            $.fn.loadModule = function (fromClick) {
                if (!layout.fullScreenMode()) {
                    $(".col-sidebar").fadeOut('fast', function () {
                        $('body').removeClass('stop-scrolling');
                        // TODO: probably needs tidy-up
                        //layout.selectedItem('.col-sidebar', '#toggle-index');
                    });
                }
                kernel.trigger('cleanWorkspace');

                var moduleElement = $(this);

                HookManager.executeHook('loadModuleHook', [kernel, moduleElement, fromClick, true], _.bind(function () {
                    kernel.trigger('loadModule', _.object(params, [true, $(this).data('ajax-url'),
                        $(this).data('module-id'), $(this).data('module-version'), $(this).attr('href'), $(this).data('dependencies-url'), fromClick, $(this)]));
                }, this));


                return false;
            };
        }

    });
});
