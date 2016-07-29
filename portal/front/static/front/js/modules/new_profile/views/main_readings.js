define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth',
    './Generic',
    '../models/reading',
    '../collections/readings',
    'text!../templates/readings/collection.html',
    'text!../templates/readings/book_tools_fill.html',
    '../views/readings'
], function ($, _, Backbone, EpoAuth, GenericView, ReadingsModel, ReadingsCollection, readingsListTemplate, bookToolsFill, ReadingsView) {

    var ReadingsFilterView = Backbone.View.extend({
        el: $('.readings-aside'),

        initialize: function(){
            var _this = this;

            this.$el.find('#book_order_select').change(function(){
                _this.trigger('sorting', {
                    option: $(this).find(':selected').val()
                });
            });
        }

    });

    var MainReadingsView = GenericView.extend({
        el: $(".readings-content-wrap"),
        viewButton: '#profile-readings-tab',

        postInitialize: function (options) {
            this._options = options;

            EpoAuth.connectEventObject(this);
            this.readingsFilterView = new ReadingsFilterView();
            this.readingsListView = new ReadingsView();

            var _this = this;

            this.listenTo(this.readingsFilterView, 'sorting', function(event, option){
                var option = option || event.option;
                _this.filterParams = option;
                _this.render();
            });

        },

        fillStats: function(url, handbook_ids){
            var _this = this;
            EpoAuth.apiRequest('post', url, JSON.stringify(handbook_ids), function(data){
                setTimeout(function() {
                    _.each(handbook_ids, function (hid) {
                        var book = _this.$el.find('[data-book-handbook-id="' + hid + '"]');
                        book.find('.profile-book-tools').html(_.template(bookToolsFill, {stat: data[hid]}))
                    });
                }, 2000);

            });
        },

        getData: function(cb, params) {
            var statsEndpoint = this.controller.apiData.endpoints.last_collections.stats;
            EpoAuth.apiRequest('get', this.controller.apiData.endpoints.last_collections.list, null, function (data) {
                var readingsCollection = new ReadingsCollection(data);
                readingsCollection.sortReadings(this.filterParams);
                this.$el.find('.readings-list').empty();
                _.each(readingsCollection.models, function(r){
                    this.$el.find('.readings-list').append(_.template(readingsListTemplate, {model: r.toJSON()}));
                }, this);
                this.fillStats(statsEndpoint, _.map(readingsCollection.models, function(model){return model.get('handbook_id')}));
                return readingsCollection;
            }.bind(this));
        },

        showContent: function() {

        }


    });

    return MainReadingsView;
});
