define(['require',
    'jquery',
    'bowser',
    'backbone',
    'underscore',
    './EngineInterface',
    'endpoint_tools',
    'modules/core/WomiManager',
    'text!modules/layouts/default/templates/womi_aggregate_extended.html'], function (require, $, bowser, Backbone, _, EngineInterface, endpoint_tools, WomiManager, ExtendedTpl) {

    var counter = 1;

    function nameResolver(item) {
        return item.label || item.path || 'Element ' + counter++;
    }

    function getEduLevel(metadata) {
        if(metadata.extended && metadata.extended.learningObjectives) {
            var edu = {
                'E1': 'Edukacja wczesnoszkolna',
                'E2': 'Edukacja podstawowa 4-6',
                'E3': 'Edukacja gimnazjalna',
                'E4': 'Edukacja ponadgimnazjalna'
            };

            var objectives = metadata.extended.learningObjectives;
            if(objectives.length == 0) {
                // interpreting empty objective list as all education levels
                objectives = Object.keys(edu);
            }

            var levelNames = [];
            for(i = 0; i < objectives.length; i++) {
                var level = objectives[i].split('-')[0];
                var name = edu[level]
                levelNames.push(name);
            }

            return levelNames.join(', ');
        }
        return '';
    }

    function filterEngines(manifest) {
        if (_.contains(['image', 'audio', 'video'], manifest.engine)) {
            return manifest.engine;
        }
        if (manifest.engine == 'womi_attachment') {
            var ext = manifest.mainFile.split('.');
            ext = ext[ext.length - 1];
            if(_.contains(['epub', 'pdf', 'zip', 'jpg'], ext)){
                return ext;
            }
        }
        return 'default';
    }

    var Router = Backbone.Router.extend({
        routes: {
            '': 'first',
            'show/:id': 'goto'
        }
    });

    var router = new Router();

    var SelectableView = Backbone.View.extend({
        tagName: 'div',
        itemTemplateWomi: '<li class="womi-element-li"><div class="womi-type-icon"></div><span><%= name %></span></li>',
        itemTemplateCollection: '<li class="womi-element-li"><div class="womi-type-icon www"></div><a href="<%= url %>" target="_blank"><div class="show-www-icon"></div></a><span><%= name %></span></li>',
        itemTemplateLink: '<li class="womi-element-li"><div class="womi-type-icon"></div><a href="<%= url %>" target="_blank"><div class="download-icon"></div></a><span><%= name %></span></li>',
        initialize: function (params) {
            this.placeholder = $('<div class="aggregate-item-placeholder">');
            this.list = $('<ul class="aggregate-list">');
            this.gallery = $('<ul class="aggregate-gallery">');
            this.items = params.items;
            this.forRoutingMappings = {};
            this.currentGallerySelectedImage;
        },

        getTemplateAndPattern: function(type){
              return ({
                  'womi': {template: this.itemTemplateWomi, pattern: 'womi-url-pattern', urlParams:
                  [['womi_id', 'womiId'], ['version', 'womiVersion'], ['path', 'path']]},
                  'collection-reference': {template: this.itemTemplateCollection, pattern: 'variant-url-pattern',
                  urlParams: [['collection_id', 'collectionId'], ['version', '#latest'], ['variant', '#student-canon']]}
              })[type] || {template: this.itemTemplateLink, pattern: 'womi-url-pattern', urlParams:
                  [['womi_id', 'womiId'], ['version', 'womiVersion'], ['path', 'path']]}
        },

        resolveUrlParams: function(paramsSet, item){

            var result = {};

            _.each(paramsSet, function(paramPair){
               if(paramPair[1].indexOf('#') == 0){
                   result[paramPair[0]] = paramPair[1].substring(1);
               }else{
                   result[paramPair[0]] = item[paramPair[1]];
               }
            });

            return result
        },

        generateListItems: function () {
            var _this = this;
            _.each(this.items, function (item) {
                var tap = _this.getTemplateAndPattern(item.type);
                var template = tap.template;
                var url = endpoint_tools.namedPatternUrl(tap.pattern, _this.resolveUrlParams(tap.urlParams, item));

                var listItem = new ListItem({womiParams: item, placeholder: _this.placeholder});

                if (item.role == 'thumbnail') {
                    _this.thumbnailItem = listItem;
                    return;
                }

                item.resolvedName = nameResolver(item);

                var li = $(_.template(template, {
                    name: item.resolvedName,
                    url: url
                }));

                _this.list.append(li);

                _this.setIcon(item, li);

                if (item.type != 'womi') {
                    return;
                }

                var cb = function () {
                    _this.setShownElement(li);
                    listItem.render();
                };

                var itemId = item.womiId + '_' + item.womiVersion;

                _this.forRoutingMappings[itemId] = cb;

                if (!_this.firstItem) {
                    _this.firstItem = itemId;
                }

                li.click(function () {
                    window.scrollTo(0, 0);
                    router.navigate('show/' + itemId, {trigger: true});
                });


            });
        },

        getImage: function (womiId, callback) {
            var id = womiId;
            var baseUrl = "//preview.{{ TOP_DOMAIN }}/content/womi/" + id;
            $.ajax({
                type: 'get',
                url: baseUrl + '/manifest.json',
                context: this,
                success: function(response) {
                    if (response.engine === 'image') {
                        var imgUrl = baseUrl + "/" + "classic-" + response.parameters.classic.resolution[1] + "." + this.getExt(response.parameters.classic.mimeType);
                        callback(imgUrl);
                    }
                }
            });
        },

        getExt: function(mime){
            var mimes = {
                'image/jpeg': 'jpg',
                'image/pjpeg': 'jpg',
                'image/png': 'png',
                'image/svg+xml': 'svg',
                'image/svg': 'svg',
                'svg': 'svg'
            };
            return mimes[mime];
        },

        generateGallery: function(gallery) {
            var _this = this;

            _.each(gallery.womis, function (womi) {

                womi.resolvedName = nameResolver(womi);

                var galleryItem = new GalleryItem({womiParams: womi, placeholder: _this.placeholder, gallery: _this.gallery });
                galleryItem.render();
                _this.getImage(womi.womiId, function(imgUrl){
                    var image = galleryItem.image.find('.gallery-image');
                    $("<img/>").load(function(){
                        var realW = this.naturalWidth;
                        var realH = this.naturalHeight;
                        if (realH > realW) {
                            $(this).css({
                                "width": "100px",
                                "height": "130px"
                            });
                        } else {
                            $(this).css({
                                "width": "130px",
                                "height": "100px",
                                "left": "-15px"
                            });
                        }
                    }).attr("src", imgUrl).appendTo(image);
                    galleryItem.image.attr('data-womiid', womi.womiId);
                    galleryItem.image.attr('data-womiversion', womi.womiVersion);
                });

                var cb = function () {
                    _this.setSelectedGalleryImage(galleryItem.image);
                    galleryItem.selectImage();

                    var prev = _this.currentGallerySelectedImage.prev();
                    var next = _this.currentGallerySelectedImage.next();

                    _this.placeholder.find('.prev').hover(function(){
                        $(this).css('opacity', '0.8');
                    }, function(){
                        $(this).css('opacity', '0');
                    });

                    _this.placeholder.find('.next').hover(function(){
                        $(this).css('opacity', '0.8');
                    }, function(){
                        $(this).css('opacity', '0');
                    });

                    _this.placeholder.find('.prev').click(function(){
                        if (prev.length > 0) {
                            var itemId = prev.data('womiid') + '_' + prev.data('womiversion');
                            router.navigate('show/' + itemId, {trigger: true});
                        } else {
                            console.log("Brak poprzedniego elementu !");
                        }
                    });

                    _this.placeholder.find('.next').click(function(){
                        if (next.length > 0) {
                            var itemId = next.data('womiid') + '_' + next.data('womiversion');
                            router.navigate('show/' + itemId, {trigger: true});
                        } else {
                            console.log("Brak nastepnego elementu !");
                        }
                    });
                };
                var itemId = womi.womiId + '_' + womi.womiVersion;
                _this.forRoutingMappings[itemId] = cb;

                if (!_this.firstItem) {
                    _this.firstItem = itemId;
                    _this.currentGallerySelectedImage = galleryItem.image;
                }

                galleryItem.image.click(function () {
                    window.scrollTo(0, 0);
                    router.navigate('show/' + itemId, {trigger: true});
                });

            });

        },

        setSelectedGalleryImage: function (galleryImage) {
            this.currentGallerySelectedImage = galleryImage;
            $('.aggregate-gallery').find('.current').remove();
            galleryImage.prepend('<div class="current"></div>');

        },

        setIcon: function (item, li) {
            if(typeof item.womiId === 'undefined'){
                return;
            }
            var url = endpoint_tools.namedPatternUrl('womi-url-pattern', {
                womi_id: item.womiId,
                version: item.womiVersion,
                path: 'manifest.json'
            });
            require(['json!' + url], function (manifest) {
                li.find('.womi-type-icon').addClass(filterEngines(manifest));
            });

        },

        setShownElement: function (li) {
            this.list.find('li').each(function (index, element) {
                $(element).find('.current').remove();
                if (element == li[0]) {
                    li.prepend('<div class="current womi-type-icon view"></div>');
                }
            })
        },

        render: function () {
            var gallery = _.find(this.items, function(item){
                return item.type == 'image_gallery';
            });
            this.$el.append(this.placeholder);
            if(gallery !== undefined){
                this.$el.append(this.gallery);
                this.generateGallery(gallery);
            } else {
                this.$el.append(this.list);
                this.generateListItems();
            }

            return this.$el;
        }

    });

    var AggregateItem = Backbone.View.extend({
        tagName: 'div',
        initialize: function (options) {
            this.item = options;
        },


        _renderWomi: function () {
            var _this = this;
            if(this.item.womiId) {
                WomiManager.loadSingleWOMI(this.item.womiId, this.$el, function (container, manifest) {
                });
            }
        },

        render: function () {
            this._renderWomi();
            this.item.role != 'thumbnail' && $('#dynamic-womi > .womi-container > .title').text(this.item.resolvedName);
        }
    });

    var ListItem = Backbone.View.extend({
        initialize: function (options) {
            this.womiParams = options.womiParams;
            this.placeholder = options.placeholder;
        },

        render: function () {
            var aggItem = new AggregateItem(this.womiParams);
            var _this = this;
            this.placeholder.children().first().hide(500, function(){

            });
            _this.placeholder.html('');
            _this.placeholder.append(aggItem.$el);
            aggItem.render();

        }
    });

    var GalleryItem = Backbone.View.extend({
        //itemTemplateImage: '<li class="gallery-item"><div class="gallery-image"></div></li>',
        //itemTemplateImage: '<li class="gallery-item"><div class="gallery-image"><img class="scaled-image"></div></li>',
        itemTemplateImage: '<li class="gallery-item"><div class="gallery-image"></div></li>',
        galleryNavTemplate: '<a class="<%= site %>"><button class="<%= site %>-btn"><span class="wcag-hidden-inside"><%= wcagSiteLabel %> slajd galerii</span></button></a>',
        initialize: function (options) {
            this.womi = options.womiParams;
            this.placeholder = options.placeholder;
            this.gallery = options.gallery;

        },

        render: function() {
            var _this = this;
            var li = $(_.template(_this.itemTemplateImage, {}));
            li.find('.gallery-image').attr('title', this.womi.label);
            li.find('.gallery-image').attr('alt', this.womi.label);
            li.find('.gallery-image').attr('aria-label', this.womi.label);
            this.image = li;
            this.gallery.append(li);
        },

        createGalleryNavigation: function () {

            var navNext = $(_.template(this.galleryNavTemplate, {
                site: "next",
                wcagSiteLabel: "następny"
            }));
            this.placeholder.prepend(navNext);
             var navPrev = $(_.template(this.galleryNavTemplate, {
                site: "prev",
                wcagSiteLabel: "poprzedni"
            }));
            this.placeholder.prepend(navPrev);
        },

        selectImage: function () {
            var aggItem = new AggregateItem(this.womi);
            var _this = this;
            this.placeholder.children().first().hide(500, function(){
            });
            _this.placeholder.html('');
            _this.createGalleryNavigation();
            _this.placeholder.append(aggItem.$el);
            aggItem.render();
        }
    });

    return EngineInterface.extend({
        load: function () {
            if (this._loaded) {
                return
            }
            var functions = this._parentOptions.functions;
            this._loaded = true;
            var _this = this;
            require(['reader.api'], function (ReaderApi) {
                var ra = new ReaderApi(null, false, _this.source);
                ra.getManifest(function (manifest) {
                    if (manifest.items) {
                        var view = new SelectableView({items: manifest.items});
                        _this.destination.append(view.render());

                        router.on('route:first', function () {
                            if(view.firstItem) {
                                router.navigate('show/' + view.firstItem, {replace: true, trigger: true});
                            }else if(view.thumbnailItem){
                                view.thumbnailItem.render();
                            }
                        });

                        router.on('route:goto', function (id) {
                            view.forRoutingMappings[id]()
                        });

                        var wc = _this.destination.closest('.womi-container');

                        var other = $('<div class="other-placeholder">');

                        wc.append(other);

                        var url = endpoint_tools.namedPatternUrl('womi-url-pattern', {
                            womi_id: ra.womiId,
                            version: ra.womiVersion || 1,
                            path: 'metadata.json'
                        });

                        require(['json!' + url], function(metadata){
                            other.html(_.template(ExtendedTpl, {
                                attributes: metadata,
                                nameEduLevel: getEduLevel(metadata),
                                f: functions

                            }));

                            var kzdTags = other.find('.kzd-tags');
                            metadata.keywords.forEach(function (keyword) {
                                var tag = $("<div>", {
                                    class: 'kzd-tag',
                                    text: keyword
                                });
                                kzdTags.append(tag);
                            });

                        });

                        Backbone.history.start();
                    }
                });
            });

        },
        hasFullscreen: function () {
            return false;
        }
    });
});
