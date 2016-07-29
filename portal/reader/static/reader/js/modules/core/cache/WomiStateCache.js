define(['./CacheBase', 'backbone', 'underscore'], function (Base, Backbone, _) {
    var WSCollection = Backbone.Collection.extend({

    });

    return Base.extend({
        collection: WSCollection,
        initialize: function (options) {
            var opts = {
                params: {
                    collectionKeyName: 'bookpart_id',
                    partitionKeys: [],
                    collectionEndpoint:'womi_states.womi_state_collection',
                    singleObjectEndpoint: 'womi_states.womi_state_key'
                }
            };
            _.extend(opts, options);
            Base.prototype.initialize.call(this, opts);


        }
    });
});
