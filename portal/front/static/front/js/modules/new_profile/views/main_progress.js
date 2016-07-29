define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth',
    './Generic',
    '../models/progress',
    '../collections/progress',
    '../views/progress'
], function ($, _, Backbone, EpoAuth, GenericView, ProgressModel, ProgressCollection, ProgressView) {

    function combineQuery(params){
        var ret = '';
        for(var p in params){
            if(params[p] != undefined) {
                ret += p + '=' + params[p] + '&';
            }
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
    }

    var ProgressFilterView = Backbone.View.extend({
        el: $('.progress-content-wrap .aside-toolbar'),
        initialize: function(){
            var _this = this;

            this.$el.find('#progress_order_select').change(function(){
                _this.trigger('sorting', {
                    option: $(this).find(':selected').val()
                });
            });
            this.subjectSelect = this.$el.find('#progress_subject_select');
            this.dateStart = this.$el.find('#profile-progress-date-start');
            this.dateEnd = this.$el.find('#profile-progress-date-end');
            this.orderSelect = this.$el.find('#progress_order_select');
        },

        render: function(){
            var _this = this;

            function _triggerFiltering() {
                _this.trigger('filtering', {
                        subject: _this.subjectSelect.val(),
                        dateStart: _this.dateStart.datepicker( "getDate") != null ? _this.dateStart.datepicker( "getDate").getTime() : -1,
                        dateEnd: _this.dateEnd.datepicker( "getDate" ) != null ? 24*60*60*1000 +_this.dateEnd.datepicker( "getDate" ).getTime() : -1

                    });
            }

            this.$el.find('#progress-clear-filter').click(function(){

                _this.subjectSelect.val('all');
                $("#profile-progress-date-start").val("");
                $("#profile-progress-date-end").val("");
                _this.orderSelect.val('latest');
                _this.trigger('sorting', {
                    option: 'latest'
                });
                _triggerFiltering();
            });

            this.subjectSelect.on('change', function(ev){
                _triggerFiltering(); });
            this.dateStart.on('change', function(ev){
                _this.dateEnd.datepicker( "option", "minDate", _this.dateStart.datepicker( "getDate" ) );
                _triggerFiltering(); });
            this.dateEnd.on('change', function(ev){
                _this.dateStart.datepicker( "option", "maxDate", _this.dateEnd.datepicker( "getDate" ) );
                _triggerFiltering(); });


        }
    });

    var MainProgressView = GenericView.extend({
        el: $(".progress-content-wrap"),
        viewButton: '#profile-progress-tab',

        events: {
          'click .progress-foldable': 'progressFoldingToggle' //for progress items on small screens
        },

        postInitialize: function (options) {
            this._options = options;

            EpoAuth.connectEventObject(this);
            this.filterView = new ProgressFilterView();
            this.filterView.render();

            var _this = this;

            this.filterParams = {};

            this.listenTo(this.filterView, 'filtering', function(data){

                _this.filterParams = data;
                _this.render();
            });
            this.sortingParams = {};
            this.listenTo(this.filterView, 'sorting', function(event, option){
                var option = option || event.option;
                _this.sortingParams = option;
                _this.render(true);
            });

        },
        getQueryParams: function(){
            var alwaysFilter = {
                mode: 'filter',
                use_related: 'yes'
            };

            _.extend(alwaysFilter, this.filterParams);

            return alwaysFilter;
        },

        showContent: function (sortOnly) {
            var _this = this;

            if (sortOnly) {
                var progressCollection = _this.collection;
                _this.prepareCollection(progressCollection);
                return;
            }
        },

        getData: function(cb, params) {
            var params = combineQuery(this.getQueryParams());
            EpoAuth.apiRequest('get', this.controller.apiData.endpoints.open_question.question_search + '?' + params, null, function (data) {
                var progressCollection = new ProgressCollection(data);
                this.collection = progressCollection;
                this.prepareCollection(progressCollection);
                cb.call(this, params);
            }.bind(this));
        },

        prepareCollection: function (progressCollection) {
            var _this = this;
            progressCollection.sortProgress(_this.sortingParams);
            var progressView = new ProgressView({collection: progressCollection});
            _this.$el.find('article').remove();
            
            progressView.render();
        },

        progressFoldingToggle: function(ev) {
            $(ev.target).closest('.progress-foldable').toggleClass('folded');
        }
    });

    return MainProgressView;
});
