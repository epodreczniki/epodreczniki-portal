define(['backbone',
    'underscore',
    'modules/models/gallery/GalleryItemCollection',
    'modules/models/gallery/GalleryCollection',
    'modules/models/gallery/GalleryItem',
    'modules/models/gallery/Gallery'], function (Backbone, _, GalleryItemCollection, GalleryCollection, GalleryItem, Gallery) {
    return Backbone.Model.extend({
        blacklist: ['id', 'a', 'attrWomi', 'color'],
        defaults: {
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            a: 10,
            color: '#faded3',
            attrWomi: null,
            attrType: null, //types: WOMI, gallery, null
            attrMarginLeft: 0,
            attrMarginRight: 0,
            attrMarginTop: 0,
            attrMarginBottom: 0,
            attrName: 'tile',
            womiwidth: '100',
            womitype: 'voiceover',
            womicontext: false,
            womireadingRoom: false,
            womihideCaption: 'none',
            womizoomable: false,
            womiembedded: false,
            womiautoplay: false,
            womitransparent: false,
            womiavatar: false,
            womicontent: '',
            womicontentFormat: 'classic',
            womitranscript: ''
        },

        constructor: function () {
            Backbone.Model.apply(this, arguments);
            this.on('remove', this._onRemove, this);
        },

        getDescription: function () {
            return {
                attrWomi: {
                    label: 'WOMI id',
                    type: 'text',
                    use: true
                },
                attrMarginLeft: {
                    label: 'lewy margines kafelka',
                    type: 'number',
                    min: "0",
                    max: "99",
                    use: true
                },
                attrMarginRight: {
                    label: 'prawy margines kafelka',
                    type: 'number',
                    min: "0",
                    max: "99",
                    use: true
                },
                attrMarginTop: {
                    label: 'górny margines kafelka',
                    type: 'number',
                    min: "0",
                    max: "99",
                    use: true
                },
                attrMarginBottom: {
                    label: 'dolny margines kafelka',
                    type: 'number',
                    min: "0",
                    max: "99",
                    use: true
                },
                attrName: {
                    label: 'nazwa kafelka',
                    type: 'text',
                    use: true
                },
                attrType: {
                    label: 'rodzaj mediów',
                    //type: 'readonly',
                    type: 'text',
                    use: true
                },
                womiwidth: {
                	label: 'maksymalna szerokosc danego womi w kolumnie (%)',
                	type: 'number',
                	pattern: '\\d+',
                	use: true
                },
                womitype: {
                	label: 'oznaczenie specjalnego typu WOMI',
                	type: 'text',
                	use: true
                },
                womicontext: {
                	label: 'mowi, czy womi jest przypinką',
                	type: 'boolean',
                	use: true
                },
                womireadingRoom: {
                	label: 'oznaczenie WOMI jako trafiającego "do czytelni"',
                	type: 'boolean',
                	use: true
                },
                womihideCaption: {
                	label: 'wskazanie które części opisu WOMI mają być ukrywane',
                	type: 'text',
                	use: true
                },
                womizoomable: {
                	label: 'wskazanie czy womi obrazkowe ma możliwość przybliżania',
                	type: 'boolean',
                	use: true
                },
                womiembedded: {
                	label: 'Wartość "true" oznacza, że WOMI, mimo bycia przypinką, powinno wystąpić również w treści, wartość "false" oznacza, że nie powinno ono wystąpić w treści.',
                	type: 'boolean',
                	use: true
                },
                womiautoplay: {
                	label: 'czy womi ma być uruchomione przy ładowaniu',
                	type: 'boolean',
                	use: true
                },
                womitransparent: {
                	label: 'informuje czy womi ma być wyświetlane transparentnie',
                	type: 'boolean',
                	use: true
                },
                womiavatar: {
                	label: 'informacja czy dane womi ma zostać załadowane i przetwarzane jako awatar',
                	type: 'boolean',
                	use: true
                },
                womicontent: {
                	label: 'tekst skojarzony z WOMI',
                	type: 'text',
                	use: true
                },
                womicontentFormat: {
                	label: 'format tekstu skojarzonego z WOMI',
                	type: 'text',
                	use: true
                },
                womitranscript: {
                	label: 'tekst transkrypcji dla filmów',
                	type: 'text',
                	use: true
                }
            }
        },

        cssValues: function (useMargin) {
            useMargin = (typeof useMargin == 'undefined' ? true : useMargin);
            var marginleft = (useMargin ? parseInt(this.get('attrMarginLeft')) : 0);
            var marginright = (useMargin ? parseInt(this.get('attrMarginRight')) : 0);
            var margintop = (useMargin ? parseInt(this.get('attrMarginTop')) : 0);
            var marginbottom = (useMargin ? parseInt(this.get('attrMarginBottom')) : 0);
            return {
                x: (this.get('x') - 1) * this.get('a') + marginleft * this.get('a') / 100 +1,
                y: (this.get('y') - 1) * this.get('a') + margintop * this.get('a') / 100 +1,
                width: this.get('width') * this.get('a') - ( marginleft + marginright ) * this.get('a') / 100 -1,
                height: this.get('height') * this.get('a') - ( margintop + marginbottom ) * this.get('a') / 100 -1,
                a: this.get('a'),
                color: this.get('color')
            }
        },

        toExportedJSON: function (options) {
            return _.omit(this.attributes, this.blacklist);
        },

        fullJSON: function (options) {
            var o = this.toJSON();
            if (this.get('attrType') == 'gallery') {
                o.gallery = this.getGalleryItems();
            }
            return o;
        },

        getGalleryItems: function () {
            var galleryCollection = new GalleryCollection();
            galleryCollection.fetch();
            var gallery = galleryCollection.where({blockId: this.id});
            gallery = gallery[0];
            var galleryItemCollection = new GalleryItemCollection([], {id: this.id});
            galleryItemCollection.comparator = 'position';
            galleryItemCollection.fetch();
            
            return {
                props: gallery.toJSON(),
                items: galleryItemCollection.toJSON()
            };
        },
        setGalleryItems: function (params, items) {
            var galleryCollection = new GalleryCollection();
            galleryCollection.fetch();
            var gallery = galleryCollection.where({blockId: this.id});
            if (!gallery || gallery.length == 0) {
                gallery = new Gallery({blockId: this.id});
                galleryCollection.add(gallery);
            } else {
                gallery = gallery[0];
            }
            gallery.set({
                paramStartOn: params.startOn,
                paramThumbnails: params.thumbnails,
                paramTitles: params.titles,
                paramTitle: params.title,
                paramFormatContents: params.formatContents,
                miniaturesOnly: params.miniaturesOnly,
                viewWidth: params.viewWidth,
                viewHeight: params.viewHeight,
                type: params.type
            });
            gallery.save();
            var galleryItemCollection = new GalleryItemCollection(items, {id: this.id});
            galleryItemCollection.comparator = 'position';
            galleryItemCollection.invoke('save');

        },

        _onRemove: function (model, collection, options) {
            var galleryCollection = new GalleryCollection();
            galleryCollection.fetch();
            _.each(galleryCollection.where({blockId: model.id}), function (m) {
                m.destroy();
            });

            var galleryItemCollection = new GalleryItemCollection([], {id: model.id});
            galleryItemCollection.fetch();
            galleryItemCollection.each(function (m) {
                m.destroy();
            });
            galleryItemCollection.invoke('save');

        }
    });
});