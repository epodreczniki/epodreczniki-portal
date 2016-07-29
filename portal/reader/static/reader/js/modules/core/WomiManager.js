define(['modules/core/Registry',
    'jquery',
    'underscore',
    'modules/core/Performance',
    './womi/WOMIContainer',
    './womi/WOMIImageContainer',
    'backbone',
    'modules/api/PlaceholderApi'
], function (Registry, $, underscore, Perf, WOMIContainer, WOMIImageContainer, Backbone) {


    var objList = [];

    var eventBus = {};
    _.extend(eventBus, Backbone.Events);


    function getOverride(overrides) {
        return WOMIContainer.extend({
            CLASS_MAPPINGS: function () {
                var mappings = WOMIContainer.prototype.CLASS_MAPPINGS.call(this);
                return _.extend(mappings, overrides);
            }
        });
    }


    function pushAndCatchError(Clazz, node, loader) {
        try {
            if ($(node).data('womiObject')) {
                return $(node).data('womiObject');
            }
            var obj = new Clazz({el: node});
            if (loader) {
                loader.registerWomi(obj);
            }
            obj.render();
            objList.push(obj);
            return obj;
        } catch (err) {
            console.warn('Error on element', node, err);
            $(node).append($('<div>', { html: err.message + '<br>' + err.stack }));
        }
        return null;
    }

    function loadAllGalleries() {
        var WOMIGalleryContainer = Registry.get('galleryContainer');
        $('.womi-gallery').each(function (index, element) {
            try {
                var obj = new WOMIGalleryContainer({el: element});
                objList.push(obj);
            } catch (err) {
                console.warn('Error on element', element, err);
                $(element).append($('<div>', { html: err.message + '<br>' + err.stack }));
            }
        });
    }

    function createLoader() {
        var object = {
            registeredWomis: 0,
            loadedWomis: 0,
            registerWomi: function (womi) {
                if (womi && womi.selected && womi.selected.object && !(womi.selected.options && womi.selected.options.roles.context)) {
                    this.listenTo(womi.selected.object, 'fullyLoaded', function () {
                        this.loadedWomis++;
                        if (this.registeredWomis == this.loadedWomis) {
                            this.trigger('allWomisLoaded');
                        }
                    });
                } else {
                    this.registeredWomis--;
                    if (this.registeredWomis == this.loadedWomis) {
                        this.trigger('allWomisLoaded');
                    }
                }
            }
        };

        _.extend(object, Backbone.Events);

        return object;
    }

    function loadAllWOMI(callback) {

        objList = [];
        //player.clearPlayers();
        var loader = createLoader();
        loader.on('allWomisLoaded', function () {
            Perf.stopPerformance();
            eventBus.trigger('allWomiLoaded');
        });
        var wcs = $('.womi-container');
        var filtered = [];
        wcs.each(function(){
            if(!$(this).parent().hasClass('related')) {
                filtered.push($(this));
            }
        });
        loader.registeredWomis = filtered.length;
        $(filtered).each(function (index, element) {
            //objList.push(new WOMIContainer(element));
            pushAndCatchError(WOMIContainer, element, loader);
        });
        loadAllGalleries();
        //
        //handleSvg.handleSVGImages();

        $(objList).each(function (index, womi) {
            if (womi.updateWomiMenu) {
                womi.updateWomiMenu();
            }
        });
        callback && callback();
    }

    function loadAllWOMI2(handler) {
        //objList = [];
        //setTimeout(function(){
        $(handler).find('.womi-container').each(function (index, element) {
            pushAndCatchError(WOMIContainer, element);
        });
        //}, 300);

        //handleSvg.handleSVGImages();
    }

    function disposeAllWOMI() {
        objList.forEach(function (entry) {
            entry.dispose();
        });
    }

    function resizeAll() {
        objList.forEach(function (entry) {
            entry.callResize();
        });
    }

    function recalculateAll() {
        objList.forEach(function (entry) {
            entry.callRecalculateSize();
        });

    }

    function resizeSelected(selectedWomis) {
        _.each(selectedWomis, function (womi) {
            womi.callResize();
        });
    }

    function loadSingleWOMI(id, toNode, callback, womiOverrides) {
        var fToCall = 'getWomiContainer';
        var params = [id, '100%'];
        if(typeof id == "string" && id.indexOf('/') > 0){
            fToCall = 'getWomiVersionContainer';
            params = id.split('/');
            params.push('100%');
        }
        require(['placeholder.api'], function (PlaceholderApi) {
            var api = new PlaceholderApi(toNode, false);
            api[fToCall].apply(api, params.concat([function (container, manifest) {
            //api.getWomiContainer(id, '100%', function (container, manifest) {
                toNode.append(container);
                var o = pushAndCatchError((womiOverrides ? getOverride(womiOverrides) : WOMIContainer), container);
                callback && callback(o, manifest);
            }]));
        });

    }

    return {
        load: loadAllWOMI,
        load2: loadAllWOMI2,
        disposeAll: disposeAllWOMI,
        resizeAll: resizeAll,
        recalculateAll: recalculateAll,
        resizeSelected: resizeSelected,
        loadSingleWOMI: loadSingleWOMI,
        womiEventBus: eventBus,
        get objects() {
            return objList;
        },
        wasFirstLoad: function () {
            return false;
        },
        otherReady: function (bool) {
            //otherReady = bool
        },
        switchToMobile: function () {
            objList.forEach(function (entry) {
                entry.switchToMobile();
            });
        },
        WOMIImageContainer: WOMIImageContainer
    };
});