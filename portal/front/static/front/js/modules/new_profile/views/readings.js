define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/readings',
    'text!../templates/readings/collection.html',
    'EpoAuth'
], function ($, _, Backbone, ReadingsCollection, readingsListTemplate, EpoAuth) {
    var ReadingListView = Backbone.View.extend({
        el: $(".readings-list"),

        initialize: function(){
            EpoAuth.connectEventObject(this);
        },

        render: function () {
            var _this = this;
            this.$el.html('');

            var collection = this.once(EpoAuth.POSITIVE_PING, function (data) {
                EpoAuth.apiRequest('get', data.endpoints.last_collections.list, null, function (data) {
                    var readingsCollection = new ReadingsCollection(data);
                        console.log('Readings: ' + readingsCollection.models);
                    _.each(readingsCollection.models, function(r){
                        _this.$el.append(_.template(readingsListTemplate, {model: r.toJSON()}));
                    });

                    return readingsCollection;
                });
            });

            EpoAuth.ping();

            //var compiledTemplate = _.template(readingsListTemplate, data);
            //$("#readings-list").html(compiledTemplate);
        }

    });
    return ReadingListView;
});