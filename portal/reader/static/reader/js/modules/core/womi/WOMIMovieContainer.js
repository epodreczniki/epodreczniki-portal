define(['jquery',
    'backbone',
    'underscore',
    'bowser',
    'modules/core/Registry',
    './WOMIAudioContainer',
    './WOMIImageContainer',
    'modules/core/engines/EngineInterface',
    'libs/avplayer/player.ext'
], function ($, Backbone, _, bowser, Registry, WOMIAudioContainer, WOMIImageContainer, EngineInterface, player) {
    var isTouch = true;
    var WOMIMovieContainer = WOMIAudioContainer.extend({
        maxHeight: 0.7,
        mobileWidth: 450,
        containerClass: 'movie-container',
        quality : [
            {
                "level": 1080,
                "label": "Najwyższa",
                "profile": "(,,mp4_hi_hl)",
                "type": "video/mp4"
            },
            {
                "level": 720,
                "label": "Wysoka",
                "profile": "(,,mp4_med_ml)",
                "type": "video/mp4"
            },
            {
                "level": 360,
                "label": "Średnia",
                "profile": "(,,mp4_low_bl)",
                "type": "video/mp4"
            },
            {
                "level": 270,
                "label": "Niska",
                "profile": "(,,mp4_vlow_bl)",
                "type": "video/mp4"
            },
            {
                "level": 1080,
                "label": "Najwyższa",
                "profile": "(,,webm_hi)",
                "type": "video/webm"
            },
            {
                "level": 720,
                "label": "Wysoka",
                "profile": "(,,webm_hi)",
                "type": "video/webm"
            },
            {
                "level": 360,
                "label": "Średnia",
                "profile": "(,,webm_med)",
                "type": "video/webm"
            }
//                ,{
//                    "level": 270,
//                    "label": "Niska",
//                    "profile": "(,,webm_med)",
//                    "type": "video/webm"
//                }
        ],

        _metadata: {
            Profiles: ["mp4_vlow_bl", "mp4_low_bl", "mp4_med_ml", "mp4_hi_hl", "webm_med", "webm_hi"],
            Subtitles: [],
            AltAudio: 0,
            AllowDistribution: true,
            Duration: 0
        },

        _lookForBlocks: function () {
            this.metadata = _.clone(this._metadata);
            //this._mainContainerElement = $(this._mainContainerElement[0]);
            this._keyframe = this._mainContainerElement.find('.keyframe').clone();
            this._audioTracksBlock = this._mainContainerElement.find('.audio-tracks');
            this._subtitlesBlock = this._mainContainerElement.find('.subtitles');
        },

        _discoverContent: function () {
            var _this = this;
            this._altText = this.options.altText || this._mainContainerElement.data('alt');
            this._title = this.options.title || this._mainContainerElement.data('title');
            this._width = this.options.width || this._mainContainerElement.data('width');
            this._movieId = this.options.movieId || this._mainContainerElement.data('movie-id');
            this._aspectRatio = this.options.aspectRatio || parseFloat(this._mainContainerElement.data('aspect-ratio')) || 1.78;
            this._describedBy = this._mainContainerElement.data('described-by');
            this.audioTracks = null;
            this.subtitles = null;
            if (this._audioTracksBlock.length) {
                this.audioTracks = [];
                this._audioTracksBlock.find('div').each(function (index, element) {
                    _this.audioTracks.push({
                        text: $(element).data('text'),
                        value: $(element).data('value')
                    });
                });
            }
            if (this._subtitlesBlock.length) {
                this.subtitles = [];
                this._subtitlesBlock.find('div').each(function (index, element) {
                    _this.subtitles.push({
                        text: $(element).data('text'),
                        value: $(element).data('value')
                    });
                });
            }
            if (Registry.get("layout")) {
                this.listenTo(Registry.get("layout"), "selectedPage", this._pageChanged );
            }

        },

        _pageChanged: function () {
            if(this.video && !this.video.paused()){
                this.video.pause();
            }
        },

        contextCallback: function () {
            this.hasFullscreenItem = function () {
                return true;
            };
            //this._fullscreenMenuItem().callback();
            //this._mainContainerElement[0].dispatchEvent(engines.EngineInterface.prototype._fsEvent.apply(null));
            this.parent.trigger('openContext');
            this.hasFullscreenItem = function () {
                return false;
            };
        },

        getFSElement: function () {
            var parentDiv = this._mainContainerElement.clone();
            var cloned = $('<div>');
            parentDiv = $('<div>');
            //cloned.remove();
            var _this = this;

            parentDiv.width($(window).width());
            parentDiv.height($(window).height());

            //TODO - commented jplayer code
//            if (this.player) {
//                this.player.Player.jPlayer('pause');
//            }

            return {element: parentDiv,
                cancelUpdate: true,
                options: {
                    scrolling: 'hidden',
                    helpers: {
                        overlay: {
                            locked: isTouch
                        }
                    }
                },
                afterLoad: function () {
                    this.movie = new WOMIMovieContainer({ el: cloned, options: {
                        altText: _this._altText,
                        width: _this._width,
                        aspectRatio: _this._aspectRatio,
                        movieId: _this._movieId
                    }});
                    this.movie._isFS = true;
                    parentDiv.append(this.movie.render());
                    this.movie.trigger('renderDone');

                },
                reload: function () {
                },
                afterClose: function () {
                    this.movie && this.movie.dispose();
                }
            };
        },

        _calcWidth: function () {
            var w = this._avElement.width();
            var maxH = $(window).height() * this.maxHeight;
            if (this._isFS) {
                maxH = $(window).height();
                w = $(window).width();
            }
            //console.log(w, maxH, this._aspectRatio, w / this._aspectRatio);
            if (maxH < (w / this._aspectRatio)) {
                w = maxH * this._aspectRatio;
            }
            //console.log(w);
            return w;
        },
        getAnyImage: function () {
            return this._keyframe;
        },

        _setPLLanguage: function () {
            var polish = {
                "Play": "Odtwarzaj",
                "Pause": "Pauza",
                "Current Time": "Aktualny czas",
                "Duration Time": "Czas trwania",
                "Remaining Time": "Pozostały czas",
                "Stream Type": "Rodzaj strumienia",
                "LIVE": "Na żywo",
                "Loaded": "Załadowany",
                "Progress": "Postęp",
                "Fullscreen": "Pełny ekran",
                "Non-Fullscreen": "Wyłączenie pełnego ekranu",
                "Mute": "Wycisz",
                "Unmute": "Wyłączenie wyciszenia",
                "Playback Rate": "Playback Rate",
                "Subtitles": "Napisy",
                "subtitles off": "Wyłączenie napisów",
                "Captions": "Podpisy",
                "captions off": "Wyłączenie podpisów",
                "Chapters": "Rozdziały",
                "You aborted the video playback": "Anulowano playback filmu.",
                "A network error caused the video download to fail part-way.": "Problem z siecią spowodował brak fragmentu nagrania.",
                "The video could not be loaded, either because the server or network failed or because the format is not supported.": "Nie można załadować filmu z powodu błędu połączenia.",
                "The video playback was aborted due to a corruption problem or because the video used features your browser did not support.": "Anulowano odtwarzanie filmu z powodu błędu połączenia.",
                "No compatible source was found for this video.": "Nie odnaleziono właściwego pliku źródłowego"
            };

            videojs.addLanguage('pl', polish);
        },

        _runMedia: function () {
            //createVideoPlayer(this._avElement, this._movieId, this.audioTracks, this.subtitles);
            //$(window).on('resize', this._resize());
            this.alreadyLoaded = true;
            var id = (new Date()).getTime() + '_' + this._movieId;
            this._src = '/content/womi/' + this._movieId + '/blabla';


            //TODO test movie with track and subtitles
           // this._movieId = "star_trek3";

            this._id = id;
            //this.player = null;
            this.video = null;
            var _this = this;
            var div = $('<div>', { id: id, width: this._calcWidth() });
            if (this._isFS) {
                div.height($(window).height());
            }
            div.css('margin', '0 auto');
            this.mainDiv = div;
            this._avElement.append(div);

            // TODO - commented jplayer code
//            var settings = {
//                aspectRatio: this._aspectRatio,
//                generatehtml: true,
//                autoplay: false
//            };
//            if (this._keyframe.length) {
//                var img = new WOMIImageContainer({el: this._keyframe, options: {}});
//                settings.poster = img.getUrl();
//            }
//            if (this._describedBy) {
//                settings.showTranscrptionCallback = function (id) {
//                    $.fancybox({
//                        content: $('#' + id).html()
//                    });
//                };
//                settings.transcrptionId = this._describedBy;
//            }

            // TODO - commented jplayer code
//            this.player = new player.createVideoPlayer('#' + id, '' + this._movieId, settings);
//            div.find('video').attr('title', this._altText);
//            if (this._isFS) {
//                div.find('.jp-full-screen').remove();
//            }

            this._setPLLanguage();

            this._createAltAudioButton();

            if (this._describedBy) {
                this._createTranscriptButton();
            }

            this._createSettingsButton();

            this._createDownloadButton();

            this._getMetadataInfo();

//            if (!this._isFS && (/*(bowser.firefox && bowser.version >= 30) || */bowser.msie)) {
//                var btn = div.find('.jp-full-screen');
//                btn.off('click');
//                btn.on('click', function () {
//                    _this.contextCallback();
//                });
//
//            }

            // TODO - commented jplayer code
//            var scroll  = _this._mainContainerElement.offset().top + 100;
//
//            this.videoFS = false;
//
//            var fsControl;
//
//            $('.jp-full-screen').on("click", function(ev){
//                scroll  = _this._mainContainerElement.offset().top + 100;
//                _this.videoFS = true;
//                fsControl = _this._fullscreenControl();
//            });
//
//            function windowRestore(){
//                window.setTimeout(function () {
//                    $(window).scrollTop(scroll);
//                    var after = $(window).scrollTop();
//                    _this.videoFS = false;
//                    fsControl();
//                }, 500);
//            }
//
//            $('.jp-restore-screen').on("click", function(ev){
//                windowRestore();
//            });
//
//            $(window).keyup(function(e) {
//                var code = (e.keyCode ? e.keyCode : e.which);
//                if (code == 27) {
//                    if(_this.videoFS){
//                        windowRestore();
//                    }
//                }
//            });

            //FF > 30 hack for fullscreen
            if ((bowser.firefox && bowser.version >= 30 && bowser.version < 33)) {
                var full = false;
                var change = true;
                var placeholder = $('<div>');
                var btn = div.find('.jp-full-screen');
                var clickHandlers = $._data(btn[0], "events")['click'];
                var clickFunc = [];
                _.each(clickHandlers, function (value) {
                    clickFunc.push(value.handler);
                });
                btn.off('click');
                //console.log(clickFunc);

                btn.click(function (e) {
                    var t = this;
                    e.preventDefault();
                    if (!full) {
                        _this._avElement.after(placeholder);
                        $('body').append(_this._avElement);
                    } else {
                    }
                    full = !full;
                });

                _.each(clickFunc, function (v) {
                    btn.click(v);
                });

                $(document).on('mozfullscreenchange', function () {
                    if (!change && full) {
                        placeholder.after(_this._avElement);
                        full = !full;
                        change = true;
                    } else if (full) {
                        change = false;
                    }
                });
            }

            this._activateViewPortCheck();

            $('input.note-toggle').on("click", function(){
                setTimeout(function() { _this._resizeHandler() }, 200);
            });

        },

        _createVideoPlayer: function(mainDiv, options){
            var _this = this;

            var plugins = {
                resolutionSelector: {
                    default_res: 'Średnia'
                },
                settings: {},
                download: {}
            };
            if (_this.metadata.AltAudio) {
                plugins['AltAudio'] = {};
            }
            if (_this._describedBy) {
                plugins['transcript'] = {};
            }

            options.plugins = plugins;

            mainDiv.html(_this._generateVideoTemplate(mainDiv));
            mainDiv.attr('id', mainDiv.attr('id') + Math.floor((Math.random() * 10000) + 1).toString());
            var videoElem = $(mainDiv.children()[0]);
            videoElem.attr('id', videoElem.attr('id') + Math.floor((Math.random() * 10000) + 1).toString());
            var tempId = videoElem.attr('id');

            this.videoFS = false;

            function subsCheck(vplayer){
                var captions = false;
                var subtitles = false;
                _.each(vplayer.textTrackDisplay.childIndex_, function(track){
                    if(track != null){
                        if(track.id().indexOf('vjs_captions') != -1){
                            captions = true;
                        }else if(track.id().indexOf('vjs_subtitles') != -1){
                            subtitles = true;
                        }else{
                            captions = false;
                            subtitles = false;
                        }
                    }else{
                    }
                });
                var controlBar = $(_this.video.controlBar.el());
                if(captions){
                    _.each(_this.video.textTracks(), function(subObj){
                        if(subObj.el().className == "vjs-captions vjs-text-track"){
                            var captionsBtn = controlBar.find('div.vjs-captions-button');
                            if(!captionsBtn.hasClass('shadow-selected-track')){
                                captionsBtn.addClass('shadow-selected-track');
                            }
                        }
                    });
                }else{
                    _.each(_this.video.textTracks(), function(subObj){
                         var captionsBtn = controlBar.find('div.vjs-captions-button');
                         if(captionsBtn.hasClass('shadow-selected-track')){
                            captionsBtn.removeClass('shadow-selected-track');
                         }
                    });

                }
                if(subtitles){
                     _.each(_this.video.textTracks(), function(subObj){
                        var subtitlesBtn = controlBar.find('div.vjs-subtitles-button');
                        if(!subtitlesBtn.hasClass('shadow-selected-track')){
                            subtitlesBtn.addClass('shadow-selected-track');
                        }
                    });
                }else{
                     _.each(_this.video.textTracks(), function(subObj){
                         var subtitlesBtn = controlBar.find('div.vjs-subtitles-button');
                         if(subtitlesBtn.hasClass('shadow-selected-track')){
                            subtitlesBtn.removeClass('shadow-selected-track');
                         }
                    });
                }
            }

            videojs(document.getElementById(tempId), options, function(){
                this.hotkeys({
                    volumeStep: 0.1,
                    seekStep: 5,
                    enableMute: true,
                    enableFullscreen: true
                });
                _this.video = this;

                var goodframes = 10;
                this.on('timeupdate', function(e){
                    if(goodframes++>15) {
                        $('.vjs-overlay').remove();
                    }

                    if(e.currentTarget && window.parent) {
                        var toSend = {
                            eventName: 'timeupdate',
                            currentTime: e.currentTarget.currentTime,
                            duration: e.currentTarget.duration,
                            ended: e.currentTarget.ended,
                            paused: e.currentTarget.paused,
                            seeking: e.currentTarget.seeking,
                            womiId:_this._movieId,
                            womiVersion: 1
                        };
                        window.parent.postMessage(toSend, '*');
                    }
                });

                var lastTime = 0;
                this.on('progress', function() {

                        var currentTime = _this.video.currentTime();
                        if (lastTime != currentTime || currentTime < 1.0) {
                            lastTime = currentTime;
                        } else if (_this.video.paused() === false) {
                            setTimeout(function() {
                                var nextTime = _this.video.currentTime();
                                if(nextTime == currentTime) {
                                    _this.video.overlay({
                                    overlays: [{
                                        content: 'Materiał zacina się z powodu wolnego łącza, rozważ zmianę jakości filmu',
                                        start: nextTime,
                                        end: nextTime + 2
                                    }]
                                });
                                    goodframes=0;
                                }
                            }, 100);

                        }




                });


                _this.postCreate();
                setTimeout(function(){
                    if(_this.video.width() < _this.mobileWidth){
                        _this._switchPlayerOptions(true);
                    }else{
                        _this._switchPlayerOptions(false);
                    }
                    if (window.localStorage) {
                        if(localStorage.getItem("defaultVideoResolution")) {
                            var resolutionFromStorage = localStorage.getItem("defaultVideoResolution");
                            var availabledQualities = [];
                            _.each(_this.metadata.Profiles, function(profile){
                                var _profile = "(,,"+profile+")";
                                _.each(_this.quality, function(q){
                                    if(q.profile == _profile){
                                        availabledQualities.push(q.label);
                                    };
                                });
                            });
                            if(_.contains(availabledQualities, resolutionFromStorage)){
                                _this.video.changeStartRes(resolutionFromStorage);
                            } else {
                                _this.video.changeStartRes("Średnia");
                            }
                        } else {
                             _this.video.changeStartRes("Średnia");
                        }
                    } else {
                         _this.video.changeStartRes("Średnia");
                    }

                }, 500);

                // EPP-5789 START
                var toHide = _this._mainContainerElement.find('.vjs-control-bar')
                        .children('.vjs-progress-control, .vjs-time-controls');

                _this.video.on( 'play', function() {
                    toHide.attr('aria-hidden', 'true');
                });

                _this.video.on( 'pause', function() {
                    toHide.removeAttr('aria-hidden');
                });

                var vpc = $(_this._mainContainerElement).find('.vjs-play-control');
                if (!vpc.find('.vjs-play-icon').length) {
                    vpc.append('<span aria-hidden="true" aria-live="off" class="vjs-play-icon">' + String.fromCharCode(0xE001) + '</span>' +
                                 '<span aria-hidden="true" aria-live="off" class="vjs-pause-icon">' + String.fromCharCode(0xE002) + '</span>');
                }
                // EPP-5789 END
                _this.video.on( 'changeRes', function() {
                    if (window.localStorage) {
                        localStorage.setItem("defaultVideoResolution", _this.video.getCurrentRes());
                    }
                });

                _this.video.on( 'captionstrackchange', function() {
                    subsCheck(_this.video);
                });

                _this.video.on( 'subtitlestrackchange', function() {
                    subsCheck(_this.video);
                });

                var fsControl;

                _this.video.on( 'fullscreenchange', function() {
                    var scroll  = _this._mainContainerElement.offset().top + 100;

                    function windowRestore(){
                        window.setTimeout(function () {
                            $(window).scrollTop(scroll);
                            var after = $(window).scrollTop();
                            _this.videoFS = false;
                            fsControl();
                        }, 0);
                    }

                    if(_this.video.isFullscreen()){
                        scroll  = _this._mainContainerElement.offset().top + 100;
                        _this.videoFS = true;
                        fsControl = _this._fullscreenControl();
                    }else{
                        windowRestore();
                    }
                });

            });
        },

        _generateVideoTemplate: function(videoContainer){

            var _this = this;

            if (!String.prototype.format) {
                String.prototype.format = function () {
                    var args = arguments;
                    return this.replace(/{(\d+)}/g, function (match, number) {
                        return typeof args[number] != 'undefined' ? args[number] : match;
                    });
                };
            }

            var videoTemp = '<video id="{0}_video" class="video-js vjs-default-skin vjs-big-play-centered" >';

            _.each(_this.metadata.Profiles, function(profile){

                var _profile = "(,,"+profile+")";

                var selectedQuality;

                _.each(_this.quality, function(q){
                    if(q.profile == _profile){
                        selectedQuality = q;
                    };
                });

                var format_selector = _this._movieId + _profile;

                videoTemp += '<source data-res="'+ selectedQuality.label +'" data-level="'+ selectedQuality.level +'" src="'+ _this._buildUrl(format_selector, _this.urlType.Material)+'" type="'+ selectedQuality.type +'" />';

            });

            if (_this.metadata.Subtitles) {
                _.each(_this.metadata.Subtitles, function(subs){
                    if(subs == "captions"){
                        var captionsId = _this._movieId + "_captions";
                        videoTemp += '<track kind="captions" src="'+_this._buildUrl(captionsId, _this.urlType.Subtitle)+'" srclang="pl" label="Polskie"></track>';
                    } else {
                        var subtitlesId = _this._movieId + "_subtitles";
                        videoTemp += '<track kind="subtitles" src="'+_this._buildUrl(subtitlesId, _this.urlType.Subtitle)+'" srclang="pl" label="Polskie"></track>';
                    }
                });
            }

            videoTemp += '<p class="vjs-no-js">Aby obejrzeć film włącz JavaScript w przeglądarce</p></video>';
            var formattedTemplate = videoTemp.format(this._movieId);
            videoContainer.html(formattedTemplate);
        },

        _createDownloadButton: function() {
            var _this = this;

            videojs.download = videojs.Button.extend({
                init: function(player, options){
                    videojs.Button.call(this, player, options);
                    this.on(['click', 'tap'], this.onClick);
                }
            });

            function confirm(success, text) {
                if (typeof text === 'undefined') {
                    text = 'Nie udało się skopiować linku';
                } else {
                    text = '<textarea class="video_link_area">'+text+'</textarea>';
                }
                $.fancybox.open({
                    content: success ? 'Skopiowano link do schowka' : text,
                    wrapCSS: 'fancybox-modal reader-content',
                    width: '250px',
                    height: 'auto',
                    autoSize: false,
                    afterShow: function() {
                        setTimeout(function() {$('.fancybox-inner').css({height: '50px', width: '250px', 'text-align': 'center'});
                        $('.video_link_area').css('width', '100%').select();
                        }, 0);
                    },
                    helpers: {
                        overlay: {
                            closeClick: true,
                            locked: true,
                            css: {
                                'background': 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    }
                });
            }

            videojs.download.prototype.onClick = function(ev) {
                var text = $('<textarea style="opacity: 0">');
                text[0].value = $(this.player_.tag).attr('src');
                $('body').append(text);
                text.select();
                try {
                    var successful = document.execCommand('copy');
                    if(successful == false) {
                        confirm(successful, text[0].value);
                    }
                    else {
                        confirm(successful);
                    }


                } catch (err) {
                    confirm(false);
                }
                text.remove();
            };

            function createDownloadButton() {
                var props = {
                    className: 'vjs-download-button vjs-menu-button vjs-control',
                    innerHTML: '<div class="vjs-control-content">' +
                               '<span class="vjs-download-text" ' +
                               'style="font-family: \'icomoon-full\'; font-size: 16px !important; line-height: 2em !important;" ' +
                               'title="Kopiuj bezpośredni adres filmu"></span></div>',
                    role: 'button',
                    'aria-live': 'polite',
                    tabIndex: 0
                };
                return videojs.Component.prototype.createEl(null, props);
            }

            videojs.plugin('download', function() {
                var options = { 'el' : createDownloadButton() };
                var download = new videojs.download(this, options);
                this.controlBar.el().appendChild(download.el());
            });
        },

        _createAltAudioButton: function() {
            var _this = this;

            videojs.AltAudio = videojs.Button.extend({
                init: function(player, options){
                    player.altaudio = {};
                    videojs.Button.call(this, player, options);
                    this.on(['click', 'tap'], this.onClick);
                }
            });

            videojs.AltAudio.prototype.onClick = function(ev) {
                var source = _this.video.src();
                var hasBracket = source.indexOf('(') != -1;
                if(hasBracket){
                    var firstPosition = source.indexOf('(');
                    var secondPosition = source.indexOf(',');
                    var value = source.slice(firstPosition + 1, firstPosition + 2);
                    if(value == ","){
                        source = source.slice(0, firstPosition + 1) + _this.metadata.AltAudio + source.slice(secondPosition, source.length);
                    }else{
                        source = source.slice(0, firstPosition + 1) + source.slice(secondPosition, source.length);
                    }
                }
                var profile = source.slice(source.indexOf("!") + 2, source.length);
                var type = "video/mp4";
                if(profile.indexOf('mp4') != -1){
                    type = "video/mp4";
                }else if(profile.indexOf('webm') != -1){
                    type = "video/webm";
                }
                var url = source.slice(0, source.indexOf("!") + 1);
                var hash = _this._generateHashCode( profile );
                var newSource = url + hash + profile;

                console.log(newSource);
                _this.video.src([{type: type, src: newSource }]);
                _this.video.play();

                var altAudio = _this._mainContainerElement.find('span.vjs-altaudio-text');
                if($(altAudio).hasClass('vjs-altaudio-text-oryginal')){
                    $(altAudio).removeClass('vjs-altaudio-text-oryginal');
                    $(altAudio).addClass('vjs-altaudio-text-autodescript');
                }else{
                    $(altAudio).removeClass('vjs-altaudio-text-autodescript');
                    $(altAudio).addClass('vjs-altaudio-text-oryginal');
                }

                ev.stopImmediatePropagation();
                return false;
            }

            function createAltAudioButton() {
                var props = {
                    className: 'vjs-altaudio-button vjs-menu-button vjs-control',
                    innerHTML: '<div class="vjs-control-content"><span class="vjs-altaudio-text vjs-altaudio-text-oryginal" style="font-family: \'icomoon\'; font-size: 16px !important; line-height: 2em !important;"></span></div>',
                    role: 'button',
                    'aria-live': 'polite',
                    tabIndex: 0
                };
                return videojs.Component.prototype.createEl(null, props);
            };

            videojs.plugin('AltAudio', function() {
                var options = { 'el' : createAltAudioButton() };
                var altAudio = new videojs.AltAudio(this, options);
                this.controlBar.el().appendChild(altAudio.el());
            });
        },

        _createTranscriptButton: function(){
            var _this = this;

            videojs.transcript = videojs.Button.extend({
                init: function(player, options){
                    player.transcription = {};
                    videojs.Button.call(this, player, options);
                    this.on(['click', 'tap'], this.onClick);
                }
            });

            videojs.transcript.prototype.onClick = function(ev) {
                $.fancybox({
                    content: $('#' + _this._describedBy).html()
                });
                ev.stopImmediatePropagation();
                return false;
            }

            function createTranscriptButton() {
                var props = {
                    className: 'vjs-transcript-button vjs-menu-button vjs-control',
                    innerHTML: '<div class="vjs-control-content"><span class="vjs-transcript-text" style="font-family: \'icomoon\'; font-size: 16px !important; line-height: 2em !important;"></span></div>',
                    role: 'button',
                    'aria-live': 'polite',
                    tabIndex: 0
                };
                return videojs.Component.prototype.createEl(null, props);
            };

            videojs.plugin('transcript', function() {
                var options = { 'el' : createTranscriptButton() };
                var transcriptBtn = new videojs.transcript(this, options);
                this.controlBar.el().appendChild(transcriptBtn.el());
            });

        },

        _createSettingsButton: function() {
            var _this = this;

            videojs.settings = videojs.MenuButton.extend({
                init : function( player, options ) {
                    videojs.MenuButton.call( this, player, options );
                    this.el().firstChild.firstChild.innerHTML = "";
                    this.el().firstChild.firstChild.className = " vjs-settings-text";
                    this.el().firstChild.firstChild.style.cssText = "font-family: \"icomoon\"; font-size: 16px !important; line-height: 2em !important;";
                }
            });

            videojs.settings.prototype.className = 'vjs-settings-button';

            videojs.settingsMenuItem = videojs.MenuItem.extend({
                init : function( player, options ) {
                    videojs.MenuItem.call( this, player, options );
                    this.on( ['click', 'tap'], this.onClick );
                }
            });

            videojs.settingsMenuItem.prototype.onClick = function(ev) {
                ev.preventDefault();
                var menuItemLabel = ev.currentTarget.innerHTML;
                switch(menuItemLabel){
                    case "Transkrypcja":
                        $.fancybox({
                            content: $('#' + _this._describedBy).html()
                        });
                        break;
                    case "Dźwięk":
                        var menu = $(ev.currentTarget).closest('div.vjs-menu');
                        if(menu.find('.vjs-submenu-altaudio').length == 0){
                            var htmlTemplate = "<li class='vjs-settings-submenu-audioitem'><a class='vjs-settings-menu-label' href =''>Audiodeskrypcja</a></li>" +
                                "<li class='vjs-settings-submenu-audioitem'><a class='vjs-settings-menu-label' href =''>Oryginalny</a></li>";
                            var sideMenu = $('<ul/>', {
                                class: 'vjs-submenu-altaudio'
                            });
                            sideMenu.append(htmlTemplate);
                            menu.append(sideMenu);
                            menu.find('li.vjs-settings-submenu-audioitem').on('click', function(ev){
                                var source = _this.video.src();
                                var hasBracket = source.indexOf('(') != -1;
                                if(ev.currentTarget.innerText == "audiodeskrypcja"){
                                    if(hasBracket){
                                        var firstPosition = source.indexOf('(');
                                        var secondPosition = source.indexOf(',');
                                        source = source.slice(0, firstPosition + 1) + source.slice(secondPosition, source.length);
                                    }
                                }else{
                                    if(hasBracket){
                                        var firstPosition = source.indexOf('(');
                                        var secondPosition = source.indexOf(',');
                                        source = source.slice(0, firstPosition + 1) + _this.metadata.AltAudio + source.slice(secondPosition, source.length);
                                    }
                                }
                                var profile = source.slice(source.indexOf("!") + 2, source.length);
                                var type = "video/mp4";
                                if(profile.indexOf('mp4') != -1){
                                    type = "video/mp4";
                                }else if(profile.indexOf('webm') != -1){
                                    type = "video/webm";
                                }
                                var url = source.slice(0, source.indexOf("!") + 1);
                                var hash = _this._generateHashCode( profile );
                                var newSource = url + hash + profile;
                                console.log(newSource);
                                _this.video.src([{type: type, src: newSource }]);
                                _this.video.play();
                                menu.find('.vjs-submenu-altaudio').hide();
                            });
                        }
                        menu.find('.vjs-submenu-altaudio').toggle('slide', {direction: 'right'}, 200);
                        menu.find('.vjs-submenu-quality').hide();
                        menu.find('.vjs-submenu-subtitles').hide();
                        menu.find('.vjs-submenu-captions').hide();
                        break;
                    case "Rozdzielczość":
                        var menu = $(ev.currentTarget).closest('div.vjs-menu');
                        if(menu.find('.vjs-submenu-quality').length == 0){
                            var htmlTemplate = "";
                            $.each(_this.video.availableRes, function(key){
                                if(key != "length"){
                                    htmlTemplate += "<li class='vjs-settings-submenu-qualityitem'><a class='vjs-settings-menu-label' href =''>"+key+"</a></li>";
                                }
                            });
                            var sideMenu = $('<ul/>', {
                                class: 'vjs-submenu-quality'
                            });
                            sideMenu.append(htmlTemplate);
                            menu.append(sideMenu);
                            menu.find('li.vjs-settings-submenu-qualityitem').on('click', function(ev){
                                $.each(_this.video.availableRes, function(key){
                                    if(key.toLowerCase() == ev.currentTarget.innerText){
                                        var newSource;
                                        _.each(_this.video.availableRes[key], function(res){
                                            newSource = res.src;
                                        });
                                        console.log(newSource);
                                        var profile = newSource.slice(newSource.indexOf("!") + 2, newSource.length);
                                        var type = "video/mp4";
                                        if(profile.indexOf('mp4') != -1){
                                            type = "video/mp4";
                                        }else if(profile.indexOf('webm') != -1){
                                            type = "video/webm";
                                        }
                                        _this.video.src([{type: type, src: newSource }]);
                                        _this.video.play();
                                        menu.find('.vjs-submenu-quality').hide();
                                    }
                                });
                            });
                        }
                        menu.find('.vjs-submenu-quality').toggle('slide', {direction: 'right'}, 200);
                        menu.find('.vjs-submenu-altaudio').hide();
                        menu.find('.vjs-submenu-subtitles').hide();
                        menu.find('.vjs-submenu-captions').hide();
                        break;
                    case "Napisy":
                        var menu = $(ev.currentTarget).closest('div.vjs-menu');
                        if(menu.find('.vjs-submenu-subtitles').length == 0){
                            var htmlTemplate = "<li class='vjs-settings-submenu-subtitles'><a class='vjs-settings-menu-label' href =''>wyłączone</a></li>";
                            _.each(_this.video.textTracks(), function (track){
                                if(track.options().kind == "subtitles"){
                                    htmlTemplate += "<li class='vjs-settings-submenu-subtitles' data-trackid='"+track.id()+"'><a class='vjs-settings-menu-label' href =''>"+track.options().label+"</a></li>";
                                }
                            });
                            var sideMenu = $('<ul/>', {
                                class: 'vjs-submenu-subtitles'
                            });
                            sideMenu.append(htmlTemplate);
                            menu.append(sideMenu);

                            if((_this.video.availableRes !== undefined) && (_this.video.altaudio !== undefined)){
                                menu.find('.vjs-submenu-subtitles').css("top", "-10em");
                                menu.find('.vjs-submenu-subtitles').css("bottom", "5em");
                            }else if((_this.video.availableRes === undefined) || (_this.video.altaudio == null)){
                                menu.find('.vjs-submenu-subtitles').css("top", "-8em");
                                menu.find('.vjs-submenu-subtitles').css("bottom", "3em");
                            }

                            menu.find('li.vjs-settings-submenu-subtitles').on('click', function(ev){
                                var trackid = $(this).data("trackid");
                                if(trackid !== undefined){
                                    _this.video.showTextTrack(trackid, "subtitles");
                                    menu.find('.vjs-submenu-subtitles').hide();
                                }else{
                                    _this.video.showTextTrack("", "subtitles");
                                    menu.find('.vjs-submenu-subtitles').hide();
                                }
                            });
                        }
                        menu.find('.vjs-submenu-subtitles').toggle('slide', {direction: 'right'}, 200);
                        menu.find('.vjs-submenu-captions').hide();
                        menu.find('.vjs-submenu-quality').hide();
                        menu.find('.vjs-submenu-altaudio').hide();
                        break;
                    case "Ścieżki":
                        var menu = $(ev.currentTarget).closest('div.vjs-menu');
                        if(menu.find('.vjs-submenu-captions').length == 0){
                            var htmlTemplate = "<li class='vjs-settings-submenu-captions'><a class='vjs-settings-menu-label' href =''>wyłączone</a></li>";
                            _.each(_this.video.textTracks(), function (track){
                                if(track.options().kind == "captions"){
                                    htmlTemplate += "<li class='vjs-settings-submenu-captions' data-trackid='"+track.id()+"'><a class='vjs-settings-menu-label' href =''>"+track.options().label+"</a></li>";
                                }
                            });
                            var sideMenu = $('<ul/>', {
                                class: 'vjs-submenu-captions'
                            });
                            sideMenu.append(htmlTemplate);
                            menu.append(sideMenu);

                            if((_this.video.availableRes !== undefined) && (_this.video.altaudio !== undefined)){
                                menu.find('.vjs-submenu-captions').css("top", "-10em");
                                menu.find('.vjs-submenu-captions').css("bottom", "5em");
                            }else if((_this.video.availableRes === undefined) || (_this.video.altaudio === undefined)){
                                menu.find('.vjs-submenu-captions').css("top", "-8em");
                                menu.find('.vjs-submenu-captions').css("bottom", "3em");
                            }

                            menu.find('li.vjs-settings-submenu-captions').on('click', function(ev){
                                var trackid = $(this).data("trackid");
                                if(trackid !== undefined){
                                     _this.video.showTextTrack(trackid, "captions");
                                    menu.find('.vjs-submenu-captions').hide();
                                }else{
                                    _this.video.showTextTrack("", "captions");
                                    menu.find('.vjs-submenu-captions').hide();
                                }
                            });
                        }
                        menu.find('.vjs-submenu-captions').toggle('slide', {direction: 'right'}, 200);
                        menu.find('.vjs-submenu-subtitles').hide();
                        menu.find('.vjs-submenu-quality').hide();
                        menu.find('.vjs-submenu-altaudio').hide();
                        break;
                    default:
                    break;
               }
               ev.stopImmediatePropagation();
                return false;
            }

            videojs.settings.prototype.createItems = function() {
                var player = this.player();
                var items = [];

                if(player.transcription !== undefined){
                    items.push( new videojs.settingsMenuItem( player, {
                            el : videojs.Component.prototype.createEl( 'li', {
                                className	: 'vjs-settings-menu-item',
                                innerHTML	: 'Transkrypcja'
                            })
                        }));
                }

                _.each(player.textTracks(), function(subObj){
                    if(subObj.el().className == "vjs-subtitles vjs-text-track"){
                        items.push( new videojs.settingsMenuItem( player, {
                            el : videojs.Component.prototype.createEl( 'li', {
                                className	: 'vjs-settings-menu-item',
                                innerHTML	: 'Napisy'
                            })
                        }));

                    }
                    if(subObj.el().className == "vjs-captions vjs-text-track"){
                        items.push( new videojs.settingsMenuItem( player, {
                            el : videojs.Component.prototype.createEl( 'li', {
                                className	: 'vjs-settings-menu-item',
                                innerHTML	: 'Ścieżki'
                            })
                        }));
                    }
                });

                if(player.availableRes !== undefined){
                    items.push( new videojs.settingsMenuItem( player, {
                        el : videojs.Component.prototype.createEl( 'li', {
                            className	: 'vjs-settings-menu-item',
                            innerHTML	: 'Rozdzielczość'
                        })
                    }));
                }

                if(player.altaudio !== undefined){
                    items.push( new videojs.settingsMenuItem( player, {
                        el : videojs.Component.prototype.createEl( 'li', {
                            className	: 'vjs-settings-menu-item',
                            innerHTML	: "Dźwięk"
                        })
                    }));
                }
                return items;
            }

            videojs.plugin('settings', function() {
                var player = this;
                var settings = new videojs.settings( player, {});
                player.controlBar.settings = player.controlBar.addChild( settings );
            });
        },

        _getMetadataInfo: function () {

            var _this = this;

            _this.metadata.MaterialId = _this._movieId;

            var updatedProfiles;
            var vttSubtitles;

            var path = _this._buildUrl(_this._movieId, _this.urlType.Metadata);

            $.ajax({
                type: 'GET',

                url: path,
                xhrFields: {
                    withCredentials: false
                },
                headers: {
                },
                success: function (data) {
                    data.Profiles - [];

                    $.extend(_this.metadata, data);

                    var aspectRatio = _this._aspectRatio;
                    var w = _this._calcWidth();

                    var videoOptions = {
                        "controls" : true,
                        "autoplay": false,
                        "preload": "metadata",
                        "loop": false,
                        "width": w,
                        "height": (w / aspectRatio),
                        "customControlsOnMobile": false,
                        "nativeControlsForTouch ": false,
                        "language": "pl"
                    };
                    var posterNotExists = true;
                    if (_this._keyframe.length) {
                        var img = new WOMIImageContainer({el: _this._keyframe, options: {}});
                        videoOptions["poster"] = img.getUrl();
                        posterNotExists = /\.$/.test(img.getUrl());
                    }
                    _this._createVideoPlayer(_this.mainDiv, videoOptions);
                    if (!posterNotExists) {
                        $(".vjs-poster img").css('display', 'inline');
                    }

                },
                error: function (jqXHR, textStatus, error) {
                    if (jqXHR.status === 0) {
                        console.log('Cannot connect. Verify network.');
                    } else if (jqXHR.status == 403) {
                        console.log('Access denied [403]');
                    } else if (jqXHR.status == 404) {
                        console.log('Requested page not found [404]');
                    } else if (jqXHR.status == 500) {
                        console.log('Internal Server Error [500].');
                    }
                    if (textStatus === 'parsererror') {
                        console.log('Parsing JSON failed.');
                    } else if (textStatus === 'timeout') {
                        console.log('Time out.');
                    } else if (textStatus === 'abort') {
                        console.log('Ajax request aborted.');
                    } else {
                        console.log('Uncaught Error: ' + jqXHR.responseText);
                    }
                }
            });

        },

        postCreate: function(){
            var _this = this;
            $(this.video.el()).hover(function(ev){
                ev.stopPropagation();
                $(_this.video.posterImage.el()).append("<div class='poster-overlay'><div class='meta'></div></div>");
                if (_this._title != undefined) {
                    $(_this.video.posterImage.el()).append("<div class='poster-title'><div class='poster-title-image'></div><div class='poster-title-content'>" + _this._title + "</div></div>");
                }
                else {
                    $(_this.video.posterImage.el()).append("<div class='poster-title'><div class='poster-title-image'></div></div>");
                }
            }, function(ev){
                ev.stopPropagation();
                $(_this.video.posterImage.el()).find('.poster-overlay').remove();
                $(_this.video.posterImage.el()).find('.poster-title').remove();
            });
            $(_this.video.posterImage.el()).find('img').attr('role', 'presentation');
        },

        _fullscreenControl: function () {
            var keyModuleSwitchHandler;
            var that = this;
            $.each($._data(document, "events").keydown, function (idx, el) {
                if (el.namespace == 'bottombar') {
                    keyModuleSwitchHandler = el;
                }
            });
            $(document).off('keydown.bottombar');

            return function () {
                if (keyModuleSwitchHandler != null) {
                    $(document).on('keydown.bottombar', keyModuleSwitchHandler);
                }
            }
        },

        _activateViewPortCheck: function() {
            this.allowViewPortCheck = true;
            var _this = this;
            function viewPortCheck(){
                if(_this && _this.mainDiv && !_this.videoFS && _this.mainDiv.height() < 1 && _this.video && !_this.video.paused()){
                    _this.video.pause();
                }
                if(_this && _this.mainDiv && _this.allowViewPortCheck){
                    setTimeout(viewPortCheck, 500);
                }
            }
            setTimeout(viewPortCheck, 500);
        },

        dispose: function () {
            this.allowViewPortCheck = false;
            //$(window).off('resize', this._resize());
            // TODO - commented jplayer code
//            $(this.player).jPlayer("destroy");
        },

        _resize: function () {
            var _this = this;
            if (!this._resizeHandler) {
                this._resizeHandler = function () {
                    var aspectRatio = _this._aspectRatio;
                    var w = _this._calcWidth();
                    $(_this.mainDiv).width(w);
                    if (this._isFS) {
                        _this.mainDiv.height($(window).height());
                    }
                    // TODO - commented jplayer code
//                    if (!$(_this.mainDiv).hasClass('jp-video-full')) {
//                        var playerHeight = $(_this.mainDiv).find('.jp-jplayer').height(w / aspectRatio).width(w).find('img').height(w / aspectRatio).width(w).height();
//                        $(_this.mainDiv).find('.jp-video-play').css({ 'margin-top': '-' + playerHeight + 'px', 'height': playerHeight + 'px' });
//                        //$(_this.player).jPlayer('option', 'size', {width: w, height: playerHeight});
//                    }

                    if (_this.video) {
                        _this.video.width(w);
                        _this.video.height(w / aspectRatio);
                    }

                    if(w < _this.mobileWidth){
                        _this._switchPlayerOptions(true);
                    }else{
                        _this._switchPlayerOptions(false);
                    }
                }
            }
            return this._resizeHandler;
        },

        _switchPlayerOptions: function (isMobile){
            var _this = this;
            if (_this.video) {

                var controlBar = $(_this.video.controlBar.el());

                if(isMobile){
                    controlBar.find('div.vjs-subtitles-button').hide();
                    controlBar.find('div.vjs-captions-button').hide();
                    controlBar.find('div.vjs-altaudio-button').hide();
                    controlBar.find('div.vjs-transcript-button').hide();
                    controlBar.find('div.vjs-res-button').hide();
                    controlBar.find('div.vjs-settings-button').show();
                }else{
                    _.each(_this.video.textTracks(), function(subObj){
                        if(subObj.el().className == "vjs-subtitles vjs-text-track"){
                            controlBar.find('div.vjs-subtitles-button').show();
                        }
                        if(subObj.el().className == "vjs-captions vjs-text-track"){
                            controlBar.find('div.vjs-captions-button').show();
                        }
                    });

                    if(_this.video.transcription !== undefined){
                        controlBar.find('div.vjs-transcript-button').show();
                    }

                    if(_this.video.availableRes !== undefined){
                        controlBar.find('div.vjs-res-button').show();
                    }

                    if(_this.video.altaudio !== undefined){
                        controlBar.find('div.vjs-altaudio-button').show();
                    }

                    controlBar.find('div.vjs-settings-button').hide();
                }
            }

        },

        hasFullscreenItem: function () {
            return false;

        }
    });
    return WOMIMovieContainer;
});