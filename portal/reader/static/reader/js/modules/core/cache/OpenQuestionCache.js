define(['./CacheBase', 'backbone', 'underscore'], function (Base, Backbone, _) {
    var OQCollection = Backbone.Collection.extend({

    });

    return Base.extend({
        collection: OQCollection,
        initialize: function (options) {
            var opts = {
                params: {
                    collectionKeyName: 'handbook_id',
                    partitionKeys: [],
                    collectionEndpoint:'open_question.question_list',
                    singleObjectEndpoint: 'open_question.question_update'
                }
            };
            _.extend(opts, options);
            Base.prototype.initialize.call(this, opts);

        }
    });
});
