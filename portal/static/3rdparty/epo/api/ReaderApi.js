define('reader.api', ['declare', 'jquery', 'backbone'], function (declare, $, Backbone) {
    return declare({
        instance: {
            constructor: function (requireContext) {
                this.require = requireContext;
            },

            getFullPath: function (path) {
                return this.require.toUrl(path);
            },

            _makeGet: function (varName, callback, eventName) {
                var evt = function (event) {
                    if (event.originalEvent.data.eventName == eventName && event.originalEvent.data.varName == varName) {
                        callback(event.originalEvent.data.value);
                        $(window).off('message', evt);
                    }
                };
                $(window).on('message', evt);
                window.parent.postMessage({object: 'api', method: eventName, args: [varName]}, '*');
            },

            _makeSet: function (varName, value, methodName) {
                window.parent.postMessage({object: 'api', method: methodName, args: [varName, value]}, '*');
            },

            setLocalUserVar: function (eventName, value) {
                this._makeSet(eventName, value, 'setLocalUserVar');
            },
            getLocalUserVar: function (varName, callback) {
                this._makeGet(varName, callback, 'getLocalUserVar');
            },
            setUserVar: function (varName, value) {
                this._makeSet(varName, value, 'setUserVar');
            },
            setUserAnswer: function (value) {
                this._makeSet('__userAnswer__', value, 'setUserAnswer');
            },
            getUserVar: function (varName, callback) {
                this._makeGet(varName, callback, 'getUserVar');
            },
            getPosition: function (callback) {
                this._makeGet('pos', callback, 'getPosition');
            },
            getTileSize: function (callbackDone, callbackError) {
                this._makeGet('tileSize', function (data) {
                    if (data.tiledLayout) {
                        delete data['tiledLayout'];
                        callbackDone && callbackDone(data);
                    } else {
                        callbackError && callbackError();
                    }
                }, 'getTileSize');
            },
            getAudioUrl: function (womiId, callback) {
                this._makeGet(womiId, callback, 'getAudioUrl');
            },
            getVideoUrl: function (womiId, callback) {
                this._makeGet(womiId, callback, 'getVideoUrl');
            },
            maximize: function () {
                window.parent.postMessage({object: 'api', method: 'maximize', args: []}, '*');
            },
            closeMaximize: function () {
                window.parent.postMessage({object: 'api', method: 'closeMaximize', args: []}, '*');
            },
            getModes: function(callback){
                this._makeGet('modes', callback, 'getModes');
            },
            getUserInfo: function(callback){
                this._makeGet('userInfo', callback, 'getUserInfo');
            },
            sendMail: function(data){
                this._makeSet('sendMail', data, 'sendMail');
            },
            __saveFile: function(filename, fileData, descriptor, callback, eventName){
                var evt = function (event) {
                    if (event.originalEvent.data.eventName == eventName && event.originalEvent.data.filename == filename) {
                        callback(event.originalEvent.data.value);
                        $(window).off('message', evt);
                    }
                };
                $(window).on('message', evt);
                window.parent.postMessage({object: 'api', method: eventName, args: [filename, fileData, descriptor]}, '*');
            },
            saveFile: function(filename, fileData, descriptor, callback){
                return this.__saveFile(filename, fileData, descriptor, callback, 'saveFile');
            },
            saveImageFile: function(filename, fileData, descriptor, callback){
                return this.__saveFile(filename, fileData, descriptor, callback, 'saveImageFile');
            },
            getFileUrl: function (descriptor, callback) {
                this._makeGet(descriptor, callback, 'getFileUrl');
            }
        }});
});
