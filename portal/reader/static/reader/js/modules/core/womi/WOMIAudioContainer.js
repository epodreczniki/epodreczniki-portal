define(['jquery', 'backbone', 'underscore', 'modules/core/Registry', './WOMIContainerBase', 'bowser'], function ($, Backbone, _, Registry, Base, bowser) {
    return Base.extend({
        containerClass: 'audio-container',
        urlType: {Material: 0, Subtitle: 1, Metadata: 2},

        _metadata: {
            Profiles: ["audio_low_aac","audio_med_aac","audio_med_ogg"],
            Subtitles: [],
            AltAudio: 0,
            AllowDistribution: true,
            Duration: 0
        },

        _discoverContent: function () {
            this.metadata = _.clone(this._metadata);
            this._altText = this._mainContainerElement.data('alt');
            this._audioId = this._mainContainerElement.data('audio-id');
            this._width = this._mainContainerElement.data('width');
            this._id = (new Date()).getTime() + '_' + this._audioId;
        },
        load: function () {
            var _this = this;

            _this.alreadyLoaded = false;

            this.on('renderDone', function () {
                !_this.alreadyLoaded && _this._runMedia();
                if (this.parent && this.parent.el) {
                    $(this.parent.el).addClass("womi-audio-container"); // needed for CSS styling
                }
            });
            if (this._mainContainerElement.find('.generated-av').length > 0 && !this._avElement) {
                this._mainContainerElement.find('.generated-av').remove();
            }
            if (!this._avElement) {

                this._avElement = $('<div />', {
                    'class': 'generated-av',
                    //style: 'width: ' + (this._width ? this._width : '100%') + ";",
                    id: this._id
                });

                this._mainContainerElement.append(this._avElement);
                this.on('resize', this._resize());
                //this._runMedia();

            }

        },
        _resize: function () {
            var _this = this;
            if (_this._audioEl && _this._audioEl.parents('.pagination-page:not(.pagination-page-blurred)').length
                && _this._audioEl[0] && _this._audioEl[0].player && _this._audioEl[0].player.waveform
                && _this._audioEl[0].player.waveform.surfer) {
                _this._audioEl[0].player.waveform.surfer.drawBuffer();
            }
            return function () {
                //console.log(_this._mainContainerElement);
            };
        },
        _setPLLanguage: function () {
            var polish = {
                "Play": "Odtwarzaj",
                "Pause": "Pauza",
                "Mute": "Wycisz",
                "Unmute": "Wyłączenie wyciszenia"
            };

            videojs.addLanguage('pl', polish);
        },
        _runMedia: function () {

            var div = $('<div>', {id: this._id, 'class': 'simple-audio-player'});
            var _this = this;
            this._audioEl = $('<audio class="video-js vjs-default-skin vjs-big-play-centered">');
            this._avElement.append(this._audioEl);

            this._setPLLanguage();

//            require(['reader.api'], function (ReaderApi) {
//                var readerApi = new ReaderApi(require, true);
//                readerApi.bindAudio(div, _this._audioId + '');
//            }
            this._getMetadataInfo();
            //console.log('audio player', this._mainContainerElement);
            this.alreadyLoaded = true;
        },
        dispose: function () {
            if (this._resize) {
                this.off('resize', this._resize());
            }
            if (this._avElement != null) {
                this._avElement.remove();
                this._avElement = null;
            }
        },
        getFSElement: function () {
            return {element: this._avElement.clone(), options: {}};
        },
        hasFullscreenItem: function () {
            return false;
        },

        _generateHashCode: function (id) {
            var hash = 238;
            for (var i = 0; i < id.length; i++) {
                hash = hash ^ id.charCodeAt(i);
            }
            hash = 65 + hash % 25;
            var letter = String.fromCharCode(hash);
            return letter;
        },

        _buildUrl: function (newid, urlType) {

            var _this = this;

            var hashCodeStart = '!';

            var RepositoryGlobalSettings = {
                url: "http://av.epodreczniki.pl/RepositoryAccess/",
                subtitles_url: "//www.{{ TOP_DOMAIN }}/reader/utils/av/",
                metadata_url: "//www.{{ TOP_DOMAIN }}/reader/utils/av/meta/"
            };

            var path = '';
            var baseUrl;

            switch (urlType) {
                case _this.urlType.Material:
                    baseUrl = RepositoryGlobalSettings.url;
                    break;
                case _this.urlType.Subtitle:
                    baseUrl = RepositoryGlobalSettings.subtitles_url;
                    break;
                case _this.urlType.Metadata:
                    baseUrl = RepositoryGlobalSettings.metadata_url;
                    break;
            }
            var hashCode = _this._generateHashCode(String(newid));

            path = baseUrl + hashCodeStart + hashCode + newid;

            return path;
        },

        _getQualities: function () {

            return [
                {
                    "level": 0,
                    "label": "Niska",
                    "profile": "(,,audio_low_aac)",
                    "type": "audio/mp4"
                },
                {
                    "level": 1,
                    "label": "Średnia",
                    "profile": "(,,audio_med_aac)",
                    "type": "audio/mp4"
                },
                {
                    "level": 0,
                    "label": "Niska",
                    "profile": "(,,audio_low_ogg)",
                    "type": "audio/ogg"
                },
                {
                    "level": 1,
                    "label": "Średnia",
                    "profile": "(,,audio_med_ogg)",
                    "type": "audio/ogg"
                }
            ];
        },

        useCoolWavePresentation: (window.location.protocol === 'http:'),

        _createAudioPlayer: function (audioEl, options) {

            var el = $(audioEl);
            var _this = this;
            options.plugins = {
                resolutionSelector: {
                    default_res: 'Średnia'
                }

            };
            if(this.useCoolWavePresentation && !bowser.msie) {
                options.plugins.wavesurfer = {
                    src: "",
                    msDisplayMax: 10,
                    waveColor: "#FFC59F",
                    progressColor: "grey",
                    cursorColor: "black",
                    hideScrollbar: true
                }
            }
            var surfUrl = null;
            _.each(this.metadata.Profiles, function (profile) {

                var _profile = "(,," + profile + ")";

                var selectedQuality;

                _.each(_this._getQualities(), function (q) {
                    if (q.profile == _profile) {
                        selectedQuality = q;
                    }

                });

                var format_selector = _this._audioId + _profile;

                if(!surfUrl){
                    surfUrl = _this._buildUrl(format_selector, _this.urlType.Material);
                }
                if(!_this.useCoolWavePresentation || bowser.msie) {
                    el.append('<source data-res="' + selectedQuality.label + '" data-level="' + selectedQuality.level + '" src="' + _this._buildUrl(format_selector, _this.urlType.Material) + '" type="' + selectedQuality.type + '" />');
                }
            });
            if(this.useCoolWavePresentation && !bowser.msie) {
                //console.log("Audio url: ", surfUrl);
                options.plugins.wavesurfer.src = surfUrl;
            }

            videojs(el[0], options, function () {
                if(!_this.useCoolWavePresentation || bowser.msie) {
                    if (this.waveform !== undefined ) {
                        $(this.waveform.el()).hide();
                    }
                    $(this.posterImage.el()).show();
                    $(this.posterImage.el()).addClass('fake-wave');
                }

                var vpc = $(_this._mainContainerElement).find('.vjs-play-control');
                if (!vpc.find('.vjs-play-icon').length) {
                    vpc.append('<span aria-hidden="true" aria-live="off" class="vjs-play-icon">' + String.fromCharCode(0xE001) + '</span>' +
                               '<span aria-hidden="true" aria-live="off" class="vjs-pause-icon">' + String.fromCharCode(0xE002) + '</span>');
                }
            });



        },

        _getMetadataInfo: function () {

            var _this = this;

            this.metadata.MaterialId = _this._audioId;

            var updatedProfiles;
            var vttSubtitles;

            var path = _this._buildUrl(_this._audioId, _this.urlType.Metadata);

            $.ajax({
                type: 'GET',

                url: path,
                xhrFields: {
                    withCredentials: false
                },
                headers: {},
                success: function (data) {

                    $.extend(_this.metadata, data);

                    //var aspectRatio = _this._aspectRatio;
                    //var w = _this._calcWidth();

                    var videoOptions = {
                        "controls": true,
                        "autoplay": false,
                        "preload": "metadata",
                        "loop": false,
                        "width": '100%',
                        "height": '110px'
                    };

//                    if (_this._keyframe.length) {
//                        var img = new WOMIImageContainer({el: _this._keyframe, options: {}});
//                        videoOptions["poster"] = img.getUrl();
//                    }

                    _this._createAudioPlayer(_this._audioEl, videoOptions);

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

        }
    });
});