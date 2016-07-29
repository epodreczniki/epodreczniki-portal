define('reader.api', ['backbone', 'underscore', 'declare', 'jquery', 'libs/avplayer/player.ext', 'libs/IdGenerator', 'portal_instance', 'EpoAuth', 'modules/api/Utils', 'endpoint_tools', 'modules/core/cache/WomiStateCache', 'modules/core/cache/OpenQuestionCache', 'JIC'], function (Backbone, _, declare, $, player, IdGenerator, portal_instance, Auth, Utils, endpoint_tools, WomiStateCache, OpenQuestionCache, jic) {
    function dirname(path) {
        // http://kevin.vanzonneveld.net
        // +   original by: Ozh
        // +   improved by: XoraX (http://www.xorax.info)
        // *     example 1: dirname('/etc/passwd');
        // *     returns 1: '/etc'
        // *     example 2: dirname('c:/Temp/x');
        // *     returns 2: 'c:/Temp'
        // *     example 3: dirname('/dir/test/');
        // *     returns 3: '/dir'

        return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
    }

    var MAX_FILE_SIZE = Math.pow(2, 19); //500kb;

    var statusParse = function(status) {
        if (status == 404) {
            return 'not found';
        } else {
            return 'unknown error';
        }
    };

    var cache = new WomiStateCache({
        epoAuth: Auth
    });

    var oqCache = new OpenQuestionCache({
        epoAuth: Auth
    });

    return declare({
        'instance': {
            constructor: function (requireContext, silent, womiPath) {
                this._modes = portal_instance.readerApiModes;

                //TODO: determine logged user in future
                this.userHash = 'anonymous';
                this.require = requireContext;
                var base = $('base');
                this.moduleId = base.attr('data-module-id');
                this.collectionId = base.data('collection-id');
                this.collectionVariant = base.data('collection-variant');
                this.moduleVersion = base.data('module-version');
                this.collectionVersion = base.data('collection-version');
                this.tmpContext = {};
                var womiIdPattern = /.*\/womi\/([a-zA-Z0-9_]+)(\/([0-9]+))?\/*.*/;
                var path = womiPath || this.require.toUrl('.');
                var match = path.match(womiIdPattern);
                if (match && match.length > 0) {
                    this.womiId = match[1];
                    if(match.length >= 3){
                        this.womiVersion = match[3]
                    }
                } else {
                    this.womiId = 'notresolved';
                    if (!silent) {
                        console.error('Reader Api instantiated from wrong context. Please make instances of this class only within module loaded from WOMI path.');
                    }
                }

                this.stack = [];
                this.dispatcher = _.clone(Backbone.Events);
                this._authenticate();
            },
            _authenticate: function(){
                //var bookpart_id = Utils.bookpartIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant, this.moduleId);
                if(Auth.authenticated){
                    this.authenticated = true;
                    this.endpoints = Auth.endpoints;
                    //cache.fetchCollection(bookpart_id);
                }else{
                    var _this = this;
                    this.dispatcher.listenToOnce(Auth, Auth.POSITIVE_PING, function(data){
                        _this.authenticated = true;
                        _this.endpoints = data.endpoints;
                        _this.userHash = data.user;
                        _this._callStack();
                        //cache.fetchCollection(bookpart_id);
                    });
                    Auth.ping();
                }
            },

            _callStack: function(){
                var item;
                while(item = this.stack.pop()){
                    item();
                }
            },

            getManifest: function (callback, errorCallback) {
                var _this = this;

                require(['json!' + location.protocol + endpoint_tools.namedPatternUrl('womi-url-pattern', {
                    womi_id: _this.womiId,
                    version: _this.womiVersion || '1',
                    path: 'manifest.json'
                })], function (manifest) {
                    try {
                        callback(manifest);

                    } catch (ErrorMessage) {
                        console.log(ErrorMessage)
                        errorCallback && errorCallback(ErrorMessage)
                    }

                }, function (err) {
                    //The error callback
                    errorCallback && errorCallback(err);
                })
            },
            _parseBaseUrl: function (url) {
                return dirname(url);
            },
            _keyGen: function (varName) {
                return (this.userHash + ':' + this.collectionId + ':' + this.collectionVersion + ':' + this.collectionVariant + ':' + this.moduleId + ':' + this.womiId + '_' + varName)
            },
            getFullPath: function (path) {
                return this.require.toUrl(path);
            },

            setLocalUserVar: function (varName, value, setCallback) {
                localStorage.setItem(this._keyGen(varName), value);
                if(setCallback){
                    setCallback({status: 'success'});
                }
            },
            getLocalUserVar: function (varName, getCallback) {
                var val = localStorage.getItem(this._keyGen(varName));
                var ret = {status: 'success', value: val};
                if(getCallback){
                    getCallback(ret);
                }
                return ret;
            },
            _buildRequest: function(type, varName, value, callback, err){
                var url = this.endpoints.womi_states.womi_state_key;
                var bookpart_id = Utils.bookpartIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant, this.moduleId);
                var link = Utils.buildUrl(url, {bookpart_id: bookpart_id, womi_id: this.womiId, key: varName});

                Auth.apiRequest(type, link, value, callback, err);

            },
            saveImageFile: function (filename, fileData, descriptor, callback) {
                this.saveFile(filename, fileData, descriptor, callback);
            },
            saveFile: function (filename, fileData, descriptor, callback) {
                var url = (descriptor ? this.endpoints.file_store.save_file_descriptor : this.endpoints.file_store.save_file);
                if(descriptor){
                    url = Utils.buildUrl(url, {descriptor: descriptor});
                }

                var image = new Image();

                var headers = {};
                _.extend(headers, Auth.getHeaders(), {'Accept': 'application/json'});

                image.onload = function() {
                    //adjust size
                    var maxWidth = 500;
                    var maxHeight = 700;
                    var size = { width: image.naturalWidth, height: image.naturalHeight };
                    if(image.naturalHeight > image.naturalWidth){
                        if(image.naturalHeight > maxHeight){
                            size = {};
                            size.height = maxHeight;
                            size.width = (image.naturalWidth / image.naturalHeight) * maxHeight;
                        }
                    }
                    if(image.naturalHeight <= image.naturalWidth){
                        if(image.naturalWidth > maxWidth){
                            size = {};
                            size.width = maxWidth;
                            size.height = (image.naturalHeight / image.naturalWidth) * maxWidth;
                        }
                    }

                    jic.compress(image, 85, undefined, function() {
                        jic.upload(this, url, 'file', filename, function (data) {
                            callback({
                                status: 'success',
                                data: JSON.parse(data)
                            });
                        }, function (errtext, status) {
                            if(status == 403){
                                alert('Nie możesz zapisać więcej obrazków na swoim koncie, osiągnięto limit.')
                            }
                            callback({
                                status: 'failed',
                                httpCode: status
                            });
                        }, null, headers);
                    }, size);


                };
                image.src = fileData;
            },
            getFileUrl: function(descriptor, callback){
                var url = Utils.buildUrl(this.endpoints.file_store.preview_file, {descriptor: descriptor});
                if(callback && _.isFunction(callback)){
                    callback(url);
                }
                return url;
            },
            setUserAnswer: function(value){
                this.setUserVar('__userAnswer__', JSON.stringify({answer: value}), function(){});
            },
            setUserVar: function (varName, value, setCallback) {
                var bookpart_id = Utils.bookpartIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant, this.moduleId);
                cache.putObject(bookpart_id, {bookpart_id: bookpart_id, womi_id: this.womiId, name: varName}, value, function(data){
                    if(data.length >= 1){
                        var val = data[0].get('value');
                        if(typeof val === typeof '') {
                            try {
                                val = JSON.parse(val);
                            }catch(err){
                                //not json, skip
                            }
                        }
                        setCallback && setCallback({status: 'success', value: val});
                    }else{
                       setCallback && setCallback({status: 'failed', reason: 'not found'});
                    }
                });

            },
            getUserVar: function (varName, getCallback) {
                var bookpart_id = Utils.bookpartIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant, this.moduleId);
                cache.getObject(bookpart_id, {bookpart_id: bookpart_id, womi_id: this.womiId, name: varName}, function(data){
                    if(data.length >= 1){
                        var val = data[0].get('value');
                        if(typeof val === typeof '') {
                            try {
                                val = JSON.parse(val);
                            }catch(err){
                                //not json, skip
                            }
                        }
                        getCallback({status: 'success', value: val});
                    }else{
                       getCallback({status: 'failed', reason: 'not found'});
                    }
                });

//                var exc = _.bind(function(){
//                    this._buildRequest('GET', varName, '', function(data){
//                        if(typeof data === typeof ''){
//                            data = JSON.parse(data);
//                        }
//                        getCallback({status: 'success', value: data.value});
//                    }, function(error){
//                        getCallback({status: 'failed', reason: statusParse(error.status)});
//                    });
//                }, this);
//                if(this.authenticated){
//                    exc();
//                }else{
//                    this.stack.push(exc);
//                }
                //return this.getLocalUserVar(varName, getCallback);
            },

            getOpenQuestion: function(questionId, getCallback){
                var handbook_id = Utils.handbookIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant);
                oqCache.getObject(handbook_id, {handbook_id: handbook_id, module_id: this.moduleId, question_id: questionId}, function(data){
                    if(data.length >= 1){
                        var val = data[0].toJSON();
                        if(typeof val === typeof '') {
                            try {
                                val = JSON.parse(val);
                            }catch(err){
                                //not json, skip
                            }
                        }
                        getCallback({status: 'success', value: val});
                    }else{
                       getCallback({status: 'failed', reason: 'not found'});
                    }
                });
            },

            setOpenQuestion: function(questionId, problem, value, setCallback){
                function getPageId() {
                    return (window.location.hash != '' ? window.location.hash : 'NO_PAGE_ID');
                }
                var data = {
                    problem: problem,
                    value: value,
                    page_id: getPageId(),
                    place: 0
                };
                data = JSON.stringify(data);
                var handbook_id = Utils.handbookIDGenerator(this.collectionId, this.collectionVersion, this.collectionVariant);
                oqCache.putObject(handbook_id, {handbook_id: handbook_id, module_id: this.moduleId, question_id: questionId}, data, function(data){
                    if(data.length >= 1){
                        var val = data[0].toJSON();
                        if(typeof val === typeof '') {
                            try {
                                val = JSON.parse(val);
                            }catch(err){
                                //not json, skip
                            }
                        }
                        setCallback && setCallback({status: 'success', value: val});
                    }else {
                        setCallback && setCallback({status: 'failed', reason: 'not found'});
                    }
                });
            },

            loadCss: function (url) {
                url = this.getFullPath(url);
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                document.getElementsByTagName("head")[0].appendChild(link);
            },
            getContext: function (callback) {
                var ctx = {
                    variant: this.collectionVariant,
                    isTeacher: false
                };
                if(callback && _.isFunction(callback)){
                    callback(ctx);
                }
                return ctx;
            },
            bindAudio: function (selector, womiId) {
                var s = $(selector);
                var seed = s[0].id || s[0].src || s[0].outerHTML;
                s.attr('id', (new IdGenerator(seed)).getId());
                return player.createSimpleAudioPlayer('#' + s.attr('id'), womiId);
            },
            getAudioUrl: function (id, callback) {
                var url = player.buildMediaSource(2, id).url;
                if(callback && _.isFunction(callback)){
                    callback(url);
                }
                return url;
            },
            getVideoUrl: function (id, callback) {
                var url = player.buildMediaSource(1, id).url;
                if(callback && _.isFunction(callback)){
                    callback(url);
                }
                return url;
            },
            getModes: function(){
                return this._modes;
            },
            sendMail: function(data){
                document.location.href = "mailto:xyz@something.com?subject="+ data.subject +"&body=" + data.body;
            },
            getUserInfo: function(callback){
                var alreadyDispatched = false;
                this.dispatcher.listenToOnce(Auth, Auth.POSITIVE_PING, function(data){
                    if(!alreadyDispatched){
                        callback({
                            authenticated: true,
                            username: data.user
                        });
                        alreadyDispatched = true;
                    }
                });
                this.dispatcher.listenToOnce(Auth, Auth.NEGATIVE_PING, function(data){
                    if(!alreadyDispatched){
                        callback({
                            authenticated: false,
                            username: 'niezalogowany'
                        });
                        alreadyDispatched = true
                    }
                });
                Auth.ping();
            }

        }
    });
});
