define([
    'jquery',
    'underscore',
    'backbone',
    'base_lister/filters/views/BaseResults',
    'modules/kzd/KzdResult'
], function(
    $,
    _,
    backbone,
    BaseResults,
    ResultItem
) {

    function enc(str) {
        return btoa(encodeURIComponent(escape(str)));
    }

    function dec(str) {
        return unescape(decodeURIComponent(atob(str)));
    }

    return BaseResults.extend({

        className: 'results-list',

        tagName: 'div',

        //result_tile: _.template(result_tile_template),

        initialize: function(filter, opts) {
            BaseResults.prototype.initialize.apply(this, [filter, opts]);
            $('#kzd-category-list').show();
            this.initKzdList();
            // This also needs refactor.
            // Also rethink templating system of online edition
            // Button is added in 'featured' filter in reslister/operands module.
            // Probably that proper place of binding this action?
            $('.search-trigger').on('click', function() {
                this.filter.trigger('sendNewRequest');
            }.bind(this));

            var modelLevel = this.filter.operands.findWhere({
                'field': 'educationLevels'
            });

            var modelCategory = this.filter.operands.findWhere({
                'field': 'extended_category'
            });

            var ctrl = this.controller;

            var Router = backbone.Router.extend({
                routes: {
                    'filter/:hash': 'filter'
                },

                filter: function(hash) {
                    try {
                        var data = JSON.parse(dec(hash));
                        console.log('filter with', data);
                            modelLevel.set('value', data.level, {
                                pair: true,
                                skipEvent: true
                            });
                            modelCategory.set('value', data.category, {pair: true, skipEvent: true});

                        if(ctrl.filters.models.length){
                            ctrl.filters.models[0].trigger('sendNewRequest');
                        }
                        $('#kzd-welcome-box').hide();
                        $('#kzd-lister .filter-list').show();
                    }catch(err){console.log(err)}
                }
            });

            var router = new Router();

            modelCategory.on('change:value', function (model, val, options) {
                if(options && options.skipEvent){
                    return true;
                }

                var data = {
                    level: modelLevel.get('value'),
                    category: val
                };

                console.log(data);
                try {
                    router.navigate('filter/' + enc(JSON.stringify(data)));
                }catch(err){}
                return true;
            });

            modelLevel.on('change:value', function (model, val, options) {
                if(options && options.skipEvent){
                    return true;
                }

                var data = {
                    level: val,
                    category: modelCategory.get('value')
                };

                console.log(data);

                try {
                    router.navigate('filter/' + enc(JSON.stringify(data)));
                }catch(err){}
                return true;
            });
        },

        addResult: function(result, opts) {
            //var data = _.extend({}, result.toJSON(), {
            //    cid: result.cid
            //});

            //var elem  = $('<li>', {
            //    class: 'result-item',
            //    'data-cid': data.cid
            //});

            //this.$('ul').append(elem);


            var result = new ResultItem({}, result.toJSON());

            this.$('ul').append(result.render().$el);
        },

        initKzdList: function() {
            var $kzdList = $('#kzd-category-list');
            var $kzdLevel = $("#kzd-edulevel-list");

            // Refactor this if this stay for more than two weeks without
            // totally redesign
            $kzdList.find('a.category').on('click', function(ev) {
                //var category = $(ev.currentTarget).data('category-item');
                var category = this.getProperCategoryValue($(ev.currentTarget).data('category-item'));

                var model = this.filter.operands.findWhere({
                    'field': 'extended_category'
                });
                model.set('value', [category]);

            }.bind(this));

            $kzdLevel.find('a.edu-level-switcher').on('click', function(ev) {
                var level = $(ev.currentTarget).data('level-id');

                var model = this.filter.operands.findWhere({
                    'field': 'educationLevels'
                });
                model.set('value', [level]);
            }.bind(this));

            $kzdLevel.find('li.option').on('click', function(ev) {
                ev.stopPropagation();

                var level = $(ev.currentTarget).closest('a.edu-level-switcher')
                            .data('level-id');
                var category = this.getProperCategoryValue($(ev.currentTarget).data('category-item'));

                var modelLevel = this.filter.operands.findWhere({
                    'field': 'educationLevels'
                });

                var modelCategory = this.filter.operands.findWhere({
                    'field': 'extended_category'
                });
                
                modelLevel.set('value', [level], {pair: true});
                modelCategory.set('value', [category]);
            }.bind(this));

        },

        getProperCategoryValue: function(categoryName) {
            // This method shouldn't exist at all... Sorry... :( 
            // return (categoryName === 'nasz elementarz I-III z obudową dydaktyczną' ? 'nasz elementarz' : categoryName);
            return (categoryName === 'warsztaty WOS' ? 'materiały filmowe WOS' : categoryName);
        }

    });

} );
