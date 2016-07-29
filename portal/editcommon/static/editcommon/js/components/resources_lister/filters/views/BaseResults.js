define([
    'jquery',
    'underscore',
    'backbone',
    'helpers/likedResults',
    // 'velocity',
    // 'velocityui',
    'text!base_lister/filters/templates/results/results_body.html',
    'text!base_lister/filters/templates/results/standard.html',
    'text!base_lister/filters/templates/results/tiles.html'
], function(
    $,
    _,
    backbone,
    likedResults,
    results_body,
    result_standard,
    result_tiles
) {

    return backbone.View.extend({

        className: 'results',

        initialize: function(filter, opts) {
            this.opts = opts || {};
            this.controller = this.opts.controller;
            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> OPTS: ", this.controller);
            this.filter = filter;
            this.results = filter.results;
            this.listenTo(this.results, 'reset', function() {
                this.updateResultsList(this.controller.opts);
            });
            this.listenTo(this.results, 'add', function(result) {
                this.addResult(result, this.controller.opts);
            });

            this.listenTo(this.results, 'setPaginationStatus', this.setPaginationStatus);

            $(window).bind('scroll', $.proxy(this.handleEndOfContainer, this));
        },

        remove: function() {
            $(window).unbind('scroll');
            backbone.View.prototype.remove.call(this);
        },

        events: {
            'click .choose-result': 'chooseResult',
            'click .like-result': 'handleLikeClick',
            'click .toggle-style': 'changeListStyle',
            'click .more': 'loadMoreResults'
        },

        results_body: _.template(results_body),
        result_standard: _.template(result_standard),
        result_tiles: _.template(result_tiles),

        updateResultsList: function(options, collection) {
            var opts = options || {};
            this.$el.html(this.results_body());

            if (!this.results.length) {
                this.$el.html("<h2 style='text-align: center'>Brak zasobów spełniających wybrane kryteria wyszukiwania</h2>");
            }

            this.results.each(function(result) {
                this.addResult(result, opts);
            }, this);

            this.renderPagination();
        },

        addResult: function(result, opts) {
            var options = opts || {};
            var data = _.extend({}, result.toJSON(), {
                cid: result.cid,
                liked: result.liked
            });

            var elem = $('<li>').html(
                (this.controller.opts.tilesView ?
                        this.result_tiles : this.result_standard)(data));

            var elem = $('<li>', {
                class: 'result-item',
                html: (this.controller.opts.tilesView ?
                       this.result_tiles : this.result_standard)(data)
            });

            if (this.controller.opts.likesEnabled) {
                $(elem).find('.like-result').show();
            };

            //$(elem).css('display', 'none');
            this.$('ul').append(elem);

            //if (opts.animate !== false || typeof opts.animate === 'undefined') {
            //    $(elem).velocity("transition.slideUpIn", {
            //        drag: true,
            //        duration: 50
            //    });
            //} else {
            //    $(elem).show();
            //}
        },


        chooseResult: function(ev) {
            //console.log("O P T S", this.controller.opts);
            if (this.controller.opts.selectedItemAction) {
                var cid = $(ev.target).parent().data('cid'),
                    result = this.results.get(cid);

                this.controller.opts.selectedItemAction.call(
                    undefined,
                    result.toJSON()
                );

            }

            if (this.controller.opts.killAfterSelect ||
                typeof this.controller.opts.killAfterSelect === 'undefined')
            {
                this.controller.remove();
            }
        },

        changeListStyle: function(ev) {
            this.controller.opts.tilesView = !this.controller.opts.tilesView;
            this.updateResultsList(this.controller.opts);
        },

        loadMoreResults: function() {
            this.filter.trigger('getMoreResults');
        },

        setPaginationStatus: function(resSize, reqSize) {
            this.opts.endPagination = (reqSize > resSize);
            this.renderPagination();
        },

        renderPagination: function() {
            var elem = this.$('button.more');
            if (this.opts.endPagination) {
                elem.text('Nie ma więcej wyników.');
            } else {
                elem.text('Więcej wyników...');
            }
        },

        handleLikeClick: function(ev) {
            var cid = $(ev.target).parent().data('cid');
            this.results.get(cid).trigger('toggleLiked');
            this.updateResultsList({animate: false});
        },

        handleEndOfContainer: function() {
            if ($(window).scrollTop() >= $(document).height() - $(window).height() &&
               !this.opts.endPagination &&
               !this.filter.reqInProgress)
            {
                this.loadMoreResults();
            }
        }


    });

});
