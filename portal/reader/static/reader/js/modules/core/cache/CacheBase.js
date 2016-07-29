define(['declare', 'underscore', 'backbone', 'jquery', 'modules/api/Utils'], function (declare, _, Backbone, $, Utils) {

    function getField(obj, stringPath) {
        var new_obj = obj;
        _.each(stringPath.split('.'), function (el) {
            new_obj = new_obj[el];
        });
        return new_obj;
    }

    function wrapFailsafeExecution(func){
        return function() {
            try {
                func();
            }catch(err){
                console.error(err);
            }
        }
    }

    return Backbone.View.extend({
        collection: {},//dummy

        initialize: function (options) {
            this.epoAuth = options.epoAuth;
            this.params = {};
            _.extend(this.params, options.params);
            // {collectionKeyName: 'abc', partitionKeys: ['womi_id', ...], endpoint: 'http://www....', }

            this.database = {
                collections: {}
            };
        },
        _makeCollectionObject: function (collectionKey) {
            var db = this.database;
            db.collections[collectionKey] = {
                status: 'pending',
                collection: null,
                queue: [],
                consumeQueue: function() {
                    var item;
                    while (item = this.queue.pop()) {
                        item();
                    }
                }
            }
        },

        _fillCollection: function (collectionKey, data, append) {
            var db = this.database, ret;
            var c = db.collections[collectionKey];
            if(typeof data === typeof '') {
                data = JSON.parse(data);
            }
            if(!append || (append && !c.collection)) {
                if (_.isArray(data)) {
                    ret = (c.collection = new this.collection(data));
                } else {
                    ret = (c.collection = new this.collection([data]));
                }
            }else{
                if (_.isArray(data)) {
                    ret = c.collection.add(data);
                } else {
                    ret = c.collection.add([data]);
                }
            }
            c.status = 'ready';
            c.consumeQueue();
            return ret;
        },

        _filterCollection: function(collectionKey, params){
            return this.database.collections[collectionKey].collection.where(params);
        },

        _putOnQueueCollection: function(collectionKey, f){
            return this.database.collections[collectionKey].queue.push(f);
        },

        _collectionDoesNotExist: function(collectionKey){
            return !this.database.collections[collectionKey];
        },

        _collectionPending: function(collectionKey){
            return this.database.collections[collectionKey].status === 'pending';
        },

        _collectionReady: function(collectionKey){
            return this.database.collections[collectionKey].status === 'ready';
        },

        fetchCollection: function (collectionKey) {
            var data = {};

            if(this._collectionDoesNotExist(collectionKey)){
                this._makeCollectionObject(collectionKey)
            }else{
                return;
            }

            data[this.params.collectionKeyName] = collectionKey;
            function doThat(url, _this) {
                url = Utils.buildUrl(url, data);

                _this.epoAuth.apiRequest('GET', url, null, function (data) {
                    _this._fillCollection(collectionKey, data);
                }, function(err){
                    _this._fillCollection(collectionKey, []);
                });
            }

            if (this.epoAuth.authenticated) {
                doThat(getField(this.epoAuth.endpoints, this.params.collectionEndpoint), this);
            } else {
                var _this = this;
                this.listenToOnce(this.epoAuth, this.epoAuth.POSITIVE_PING, function (d) {
                    doThat(getField(d.endpoints, _this.params.collectionEndpoint), _this);
                });
                this.epoAuth.ping();
            }
        },

        putObject: function (cKey, params, value, callback) {
            this.fetchCollection(cKey);
            var _this = this;

            function exec() {
                var url = Utils.buildUrl(getField(_this.epoAuth.endpoints, _this.params.singleObjectEndpoint), params);
                _this.epoAuth.apiRequest('PUT', url, value, function(data){
                    var filtered = _this._filterCollection(cKey, params);
                    var update = false;
                    _.each(filtered, function(m){
                        m.set(data);
                        update = true;
                    });
                    if(!update){
                        filtered = _this._fillCollection(cKey, data, true);

                    }
                    callback(filtered);
                });

            }

            if (this._collectionDoesNotExist(cKey) || (!this._collectionDoesNotExist(cKey) && this._collectionPending(cKey))) {
                this._putOnQueueCollection(cKey, wrapFailsafeExecution(exec))
            }

            if (!this._collectionDoesNotExist(cKey) && this._collectionReady(cKey)) {
                wrapFailsafeExecution(exec)();
            }
        },

        getObject: function (cKey, params, callback) {
            this.fetchCollection(cKey);
            var _this = this;
            function exec(){
                callback(_this._filterCollection(cKey, params));
            }
            if(this._collectionDoesNotExist(cKey) || (!this._collectionDoesNotExist(cKey) && this._collectionPending(cKey))){
                this._putOnQueueCollection(cKey, wrapFailsafeExecution(exec));
            }

            if(!this._collectionDoesNotExist(cKey) && this._collectionReady(cKey)){
                wrapFailsafeExecution(exec)();
            }
        }
    })
});