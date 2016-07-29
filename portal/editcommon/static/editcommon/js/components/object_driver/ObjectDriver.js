define([
    'jquery',
    'underscore',
    'declare',
    './../../utils/UrlUtils'
], function ($, _, declare, UrlUtils) {

    var PULL_URL = '//www.{{ TOP_DOMAIN }}/edit/store/api/pull/{category}/{identifier}/{version}';
    var PUSH_URL = '//www.{{ TOP_DOMAIN }}/edit/store/api/push/{category}/{identifier}/{version}';

    function parseError(params, type){
        return 'Problem z ' + (type == 'get' ? 'ładowaniem' : 'zapisem')+ ' obiektu: ' + JSON.stringify(params);
    }

    return declare({
        instance: {
            constructor: function (params, lockObject) {
                this.params = params;
                this.lockObject = lockObject;
                if (this.lockObject) {
                    this._eventDispatcher = _.extend({}, Backbone.Events);
                    this._eventDispatcher.listenTo(this.lockObject._eventDispatcher, 'lockOk', _.bind(this._lockOk, this));
                    this._toCall = null;
                }

            },

            _lockOk: function (data) {
                if(this._toCall){
                    if(_.contains(this._toCall.access, data.mode)){
                        this._toCall.call({lockid: data.lockid});
                    }
                    this._toCall = null;
                }
            },

            _req: function (type, url, data, callback, fail) {
                var _params = this.params;
                return $.ajax({
                    type: type,
                    url: url,
                    data: data,
                    success: callback || function () {
                    },
                    cache: false,
                    processData: !(data instanceof FormData),
                    contentType: false,
                    async: true,
                    error: fail || function (jqXHR, status) {
                        var stack = $(jqXHR.responseText);
                        var err = _.where(stack, {className: 'error'});
                        if(BootstrapDialog) {
                            BootstrapDialog.alert({
                                title: parseError(_params, type),
                                message: err
                            });
                        }else{
                            alert(parseError(_params, type));
                        }
                    }
                });
            },

            _buildCall: function (type, url, data, doneCallback, failCallback) {
                return _.bind(function (bonusData) {
                    if(!(this.data instanceof FormData) && bonusData){
                        this.data = _.extend(this.data, bonusData);
                    }else if ((this.data instanceof FormData) && bonusData){
                        for(var k in bonusData) {
                            this.data.append(k, bonusData[k]);
                        }
                    }
                    this.that._req(this.type,
                        UrlUtils.resolveUrl(this.url, this.that.params),
                        this.data,
                        this.doneCallback, this.failCallback);
                }, {
                    type: type,
                    url: url,
                    data: data,
                    doneCallback: doneCallback,
                    failCallback: failCallback,
                    that: this
                });

            },

            push: function (data, doneCallback, failCallback) {
                var call = this._buildCall('post', PUSH_URL, data, doneCallback, failCallback);

                if(this.lockObject){
                    if(this.lockObject.canWrite()){
                        return call({lockid: this.lockObject.lockid});
                    }else{
                        this._toCall = { access: ['write'], call: call};
                    }
                }else{
                    return call();
                }

            },

            pull: function (data, doneCallback, failCallback) {
                var call = this._buildCall('get', PULL_URL, data, doneCallback, failCallback);

                if(this.lockObject){
                    if(this.lockObject.mode && this.lockObject.mode != 'drop'){
                        return call({lockid: this.lockObject.lockid});
                    }else{
                        this._toCall = { access: ['write', 'read', 'watch'], call: call};
                    }
                }else{
                    return call();
                }
            }

        }

    });
});