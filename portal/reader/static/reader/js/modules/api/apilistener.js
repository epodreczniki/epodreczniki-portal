define(['libs/avplayer/player.ext', 'modules/utils/EmbedLinkGenerator'], function (player, EmbedLinkGenerator) {

    return function apiListener(_this, window, frame, api, commapi, avatarapi) {

        var objects = {
            api: {
                setLocalUserVar: function () {
                    api.setLocalUserVar(arguments[0], arguments[1]);
                },
                getLocalUserVar: function () {
                    var v = api.getLocalUserVar(arguments[0]);
                    frame.postMessage({ eventName: 'getLocalUserVar', varName: arguments[0], value: v }, '*');
                },
                setUserAnswer: function (varName, value) {
                    api.setUserAnswer(value);
                },
                setUserVar: function (varName, value) {
                    api.setUserVar(arguments[0], arguments[1], function(){});
                },
                getUserVar: function (varName) {
                    api.getUserVar(varName, function(data){
                        frame.postMessage({ eventName: 'getUserVar', varName: varName, value: data }, '*');
                    });
                },
                getAudioUrl: function () {
                    var id = arguments[0];
                    frame.postMessage({ eventName: 'getAudioUrl', varName: id, value: player.buildMediaSource(2, id).url }, '*');
                },
                getVideoUrl: function () {
                    var id = arguments[0];
                    frame.postMessage({ eventName: 'getVideoUrl', varName: id, value: player.buildMediaSource(1, id).url }, '*');
                },
                getPosition: function () {
                    var p = _this.getPosition();
                    p = JSON.stringify(p);
                    p = JSON.parse(p);
                    p.outerWindowWidth = $(window).width();
                    p.outerWindowHeight = $(window).height();
                    frame.postMessage({ eventName: 'getPosition', varName: 'pos', value: p }, '*');

                },
                getModes: function () {
                    frame.postMessage({ eventName: 'getModes', varName: 'modes', value: api.getModes() }, '*');
                },
                getUserInfo: function () {
                    api.getUserInfo(function(data){
                        frame.postMessage({ eventName: 'getUserInfo', varName: 'userInfo', value: data }, '*');
                    });
                },
                sendMail: function(varName, data) {
                    api.sendMail(data);
                },

                getTileSize: function () {
                    var size = {
                        tiledLayout: false
                    };
                    var grid = $('[data-grid-width]');
                    if (_this.destination && _this.destination.closest('.tile').length && grid.length) {
                        var tile = _this.destination.closest('.tile');
                        size = {
                            tiledLayout: true,
                            tileWidth: tile.data('width'),
                            tileHeight: tile.data('height'),
                            tileLeft: tile.data('left'),
                            tileTop: tile.data('top'),
                            gridWidth: grid.data('grid-width'),
                            gridHeight: grid.data('grid-height')
                        };
                    }
                    frame.postMessage({ eventName: 'getTileSize', varName: 'tileSize', value: size }, '*');
                },
                maximize: function () {
                    _this.maximize();
                },
                closeMaximize: function () {
                    _this.closeMaximize();
                },
                saveFile: function (filename, fileData, descriptor) {
                    api.saveFile(filename, fileData, descriptor, function(data){
                        frame.postMessage({ eventName: 'saveFile', filename: filename, value: data }, '*');
                    });
                },
                saveImageFile: function (filename, fileData, descriptor) {
                    api.saveFile(filename, fileData, descriptor, function(data){
                        frame.postMessage({ eventName: 'saveImageFile', filename: filename, value: data }, '*');
                    });
                },
                getFileUrl: function(descriptor){
                    var url = api.getFileUrl(descriptor);
                    frame.postMessage({ eventName: 'getFileUrl', varName: descriptor, value: url }, '*');
                }


            },
            commapi: {
                listen: function () {
                    var args = arguments;
                    commapi.listen(args[0], function (data) {
                        frame.postMessage({ eventName: args[0], data: data }, '*');
                    });
                },
                trigger: function () {
                    commapi.trigger.apply(commapi, arguments);
                }
            },
            avatarapi: avatarapi
        };

        var callback = function (event) {
            if (frame == event.originalEvent.source) {
                if (event.originalEvent.data.object) {
                    var ob = objects[event.originalEvent.data.object];
                    ob[event.originalEvent.data.method].apply(ob, event.originalEvent.data.args);
                }
            }
        };

        $(window).on('message', callback);

        var closeHandler = EmbedLinkGenerator.connectEmbedUrlGenerator(window, frame);

        return function () {
            $(window).off('message', callback);
            closeHandler();
        }
    }
});