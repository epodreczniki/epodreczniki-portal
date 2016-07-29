define([
    'jquery',
    'underscore',
    'backbone',
    'declare',
    './../../utils/UrlUtils'
], function ($, _, Backbone, declare, UrlUtils) {

    function initExpireEncounter(_this){

        var _break = false;
        _this.breakEncounter = function(){
            _break = true;
        };
        function _loop() {
            setTimeout(function () {
                if(_this.expiresin <= 0){
                    _break = true;
                    _this.expiresin = 0;
                }
                if(!_break) {
                    _this.update();
                    _loop();
                }
            }, 2000);
        }
        _loop();

    }


    var OBJECT_LOCK_ENDPOINT = '//www.{{ TOP_DOMAIN }}/edit/store/api/lock/{category}/{identifier}/{version}';

    return declare({
        instance: {
            constructor: function (params) {
                this._eventDispatcher = _.extend({}, Backbone.Events);
                this.params = params;

                window.addEventListener("unload", _.bind(this._beforeunload, this), false);
            },

            initialize: function(immediateInitCallback) {
                if (this.params.category && this.params.version && this.params.identifier) {
                    this.endpoint = UrlUtils.resolveUrl(OBJECT_LOCK_ENDPOINT, this.params);

                    //find existing lock
                    var existingLock = $('#' + this.params.category + '_' + this.params.identifier + '_' + this.params.version);
                    //console.log(existingLock);
                    if(existingLock.length == 1 && existingLock.attr('type') === 'text/lock-payload'){
                        this._eventDispatcher.once('lockOk', immediateInitCallback || function(){});
                        this._proceedOk(JSON.parse(existingLock.text()))
                    }
                }
            },

            _beforeunload: function(){
                if(this.mode && this.mode !== 'drop'){
                    //this.drop();
                    this._request('drop', null, false);
                }
                console.log('unload');
                return true;
            },

            onOk: function (callback) {
                this._eventDispatcher.on('lockOk', callback);
            },

            onFailure: function (callback) {
                this._eventDispatcher.on('lockFailure', callback);
            },

            _extendExpiresIn: function (timeout) {
                this.breakEncounter();
                this.expiresin = timeout;
                this.initExpiresin = timeout;
                this.initStamp = (new Date()).getTime() / 1000;
                initExpireEncounter(this);
            },

            update: function(){
                var now = (new Date()).getTime() / 1000;
                this.expiresin = this.initExpiresin - parseInt(now - this.initStamp);
                (this.expiresin < 20) && this._prolong();
                //console.log('expires in: ', this.expiresin);
            },

            _prolong: function(){
                this._request(this.mode);
            },

            _proceedOk: function (data) {
                this._extendExpiresIn(data.expiresin);
                this.lockid = data.lockid;
                var transition = !(this.mode === data.mode);
                this.mode = data.mode;
                this.others = data.others;
                this._eventDispatcher.trigger('lockOk', {
                    mode: this.mode,
                    lockList: data.others,
                    lockid: this.lockid,
                    transition: transition
                })
            },

            breakEncounter: function(){
                //void
            },

            _proceedFailure: function (data) {
                this.breakEncounter();
                data.expiresin = 0;
                var transition = !(this.mode === data.mode);
                this.mode = data.mode;
                this.others = data.others;
                this._eventDispatcher.trigger('lockFailure', {
                    mode: this.mode,
                    reason: data.reason,
                    lockList: data.others,
                    transition: transition
                });
            },

            _request: function (mode, callback, async) {
                if(typeof async === 'undefined'){
                    async = true;
                }

                var payload = {
                    mode: mode
                };

                if ((this.mode === mode) && callback ) {
                    callback && callback({ status: 'ok' });
                    return;
                }

                if (this.lockid) {
                    payload.lockid = this.lockid;
                }

                var f = _.bind(function (data) {
                    if (data.status === 'ok') {
                        this._proceedOk(data);
                    } else if (data.status === 'failure') {
                        this._proceedFailure(data)
                    }
                    callback && callback(data);
                }, this);

                $.ajax({
                    type: 'POST',
                    url: this.endpoint,
                    data: payload,
                    success: f,
                    dataType: 'json',
                    async: async
                });
            },

            drop: function(callback){
                return this._request('drop', callback);
            },

            watch: function(callback){
                return this._request('watch', callback);
            },

            read: function(callback){
                return this._request('read', callback);
            },

            write: function(callback){
                return this._request('write', callback);
            },

            canWrite: function(){
                return this.mode === 'write';
            }

        }
    });
});
