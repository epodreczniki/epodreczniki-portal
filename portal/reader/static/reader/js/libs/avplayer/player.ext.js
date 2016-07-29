define(['jquery'], function($){

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

var MediaType = { Video: 1, Audio: 2 };
var QualityLevels = { None: 0, High: 1080, Medium: 720, Low: 360, Lowest: 270 };
var UrlType = { Material: 0, Subtitle: 1, Metadata: 2 };

function Metadata(id, isVideo) {
    if (isVideo)
        this.Profiles = ["mp4_vlow_bl", "mp4_low_bl", "mp4_med_ml", "mp4_hi_hl", "webm_med", "webm_hi"];
    else
        this.Profiles = ["audio_low_aac", "audio_med_aac", "audio_med_ogg"];

    this.Subtitles = [];
    this.AltAudio = 0;
    this.MaterialId = id;
    this.AllowDistribution = true;
    this.Duration = 0;
}

var UrlUtil = (function () {
    function getHighestVideoLevel(profile) {
        if (profile[QualityLevels.High])
            return QualityLevels.High;
        else if (profile[QualityLevels.Medium])
            return QualityLevels.Medium;
        else if (profile[QualityLevels.Low])
            return QualityLevels.Low;
        else if (profile[QualityLevels.Lowest])
            return QualityLevels.Lowest;
        else
            return QualityLevels.None;
    }


    return {
        BuildUrl: function (id, urlType) {
            var addHashCode = true;
            var hashCodeStart = '!';



            var RepositoryGlobalSettings = {
                url: "http://av.epodreczniki.pl/RepositoryAccess/",
                subtitles_url: "//www.{{ TOP_DOMAIN }}/reader/utils/av/",
                metadata_url: "//www.{{ TOP_DOMAIN }}/reader/utils/av/meta/"
            };


            function generateHashCode(id) {
                var hash = 238;
                for (var i = 0; i < id.length; i++) {
                    hash = hash ^ id.charCodeAt(i);
                }
                hash = 65 + hash % 25;
                var letter = String.fromCharCode(hash);
                return letter;
            }


            var path = '';
            var baseUrl;
            switch (urlType) {
                case UrlType.Material:
                    baseUrl = RepositoryGlobalSettings.url
                    break;
                case UrlType.Subtitle:
                    baseUrl = RepositoryGlobalSettings.subtitles_url
                    break;
                case UrlType.Metadata:
                    baseUrl = RepositoryGlobalSettings.metadata_url
                    break;
            }

            if (addHashCode)
                path = baseUrl + hashCodeStart + generateHashCode( String(id)) + id;
            else
                path = baseUrl + id;
            return path;
        },

        UpdateProfilesList: function (metadata) {
            function mergeProfiles(current, main) {
                var intermediate = [];
                var result = [];
                for (var i in current) {
                    if (current.hasOwnProperty(i)) {
                        intermediate[i] = '(,,' + current[i] + ')';
                    }
                }

                for (var item in main) {
                    if (main.hasOwnProperty(item)) {
                        var value = main[item];
                        var index = $.inArray(value, intermediate);
                        if (index != -1) {
                            result[item] = main[item];
                        }
                    }
                }

                return result;
            }


            var Profiles = [];
            Profiles["webm"] = { 0: "", 1080: "(,,webm_hi)", 720: "(,,webm_hi)", 360: "(,,webm_med)", 270: "(,,webm_med)" };
            Profiles["mp4"] = { 0: "", 1080: "(,,mp4_hi_hl)", 720: "(,,mp4_med_ml)", 360: "(,,mp4_low_bl)", 270: "(,,mp4_vlow_bl)" };

            var AudioProfiles = [];
            AudioProfiles["mp4"] = { 0: "(,,audio_low_aac)", 1: "(,,audio_med_aac)" };
            AudioProfiles["ogg"] = { 0: "(,,audio_med_ogg)", 1: "(,,audio_med_ogg)" };

            var udpadetProfiles = [];

            if (metadata != null && metadata.hasOwnProperty('Profiles')) {
                var isAudio = false;
                for (var i = 0; i < metadata.Profiles.length; i++)
                    if (metadata.Profiles[i].indexOf('audio_') >= 0)
                        isAudio = true;

                if (isAudio) {
                    var mp4 = mergeProfiles(metadata.Profiles, AudioProfiles["mp4"]);
                    var ogg = mergeProfiles(metadata.Profiles, AudioProfiles["ogg"]);
                    udpadetProfiles["mp4"] = mp4;
                    udpadetProfiles["ogg"] = ogg;
                }
                else {
                    var mp4 = mergeProfiles(metadata.Profiles, Profiles["mp4"]);
                    var webm = mergeProfiles(metadata.Profiles, Profiles["webm"]);


                    udpadetProfiles["mp4"] = mp4;
                    udpadetProfiles["webm"] = webm;
                    var highestMp4 = getHighestVideoLevel(udpadetProfiles["mp4"]);
                    var highestWebm = getHighestVideoLevel(udpadetProfiles["webm"]);
                    if (highestMp4 != highestWebm) {
                        if (highestWebm < highestMp4)
                            udpadetProfiles["webm"][highestMp4] = udpadetProfiles["webm"][highestWebm];
                        else {
                            udpadetProfiles["mp4"][highestWebm] = udpadetProfiles["mp4"][highestMp4];
                        }
                    }
                }
            }

   
            return udpadetProfiles;
        },

        BuildMediaSource: function (mediaType, id, level, profiles, vttSubtitles, track, subtitle) {


            var firstType;
            var secondType;
            if (mediaType == MediaType.Audio)
            {
                firstType = "mp4";
                secondType = "ogg";
                if (level === undefined)
                    level = 1;
            }
            else
            {
                firstType = "mp4";
                secondType = "webm";
                if (level === undefined)
                    level = QualityLevels.Medium;
            }

            var CompareOperator = { DoNotCompare: -1, Equals: 0, LessThan: 1, GreaterThan: 2, LessOrEqual: 3, GreaterOrEqual: 4 };
            var CompareDescription = { 0: 'Equals', 1: 'LessThan', 2: 'GreaterThan', 3: 'LessOrEqual', 4: 'GreaterOrEqual', DoNotCompare: '<>', Equals: '==', LessThan: '<', GreaterThan: '>', LessOrEqual: '<=', GreaterOrEqual: '>=' };
            CompareDescription[-1] = 'DoNotCompare';
            var Devices = [
              {
                  "Device": "firefox",
                  "DisallowVTTSubtitles": false,
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.High
              },
              {
                  "Device": "windows phone",
                  "DisallowVTTSubtitles": true,
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Medium
              },
              {
                  "Device": "trident",
                  "DisallowVTTSubtitles": true,
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.High
              },
              {
                  "Device": "ipod",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "ipad",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Medium
              },
              {
                  "Device": "iphone",
                  "Version": "4_0_0",
                  "Pattern": /iphone os (\d+(?:\_\d+)+)/i,
                  "VersionOperator": CompareOperator.GreaterOrEqual,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Medium
              },
              {
                  "Device": "iphone",
                  "Version": "4_0_0",
                  "Pattern": /iphone os (\d+(?:\_\d+)+)/i,
                  "VersionOperator": CompareOperator.LessThan,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "android",
                  "Contains": "firefox",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Medium
              },
              {
                  "Device": "android",
                  "Version": "3.0",
                  "Pattern": /android (\d+(?:\.\d+)+)/i,
                  "VersionOperator": CompareOperator.GreaterOrEqual,
                  "Resolution": 800,
                  "ResolutionOperator": CompareOperator.GreaterThan,
                  "Level": QualityLevels.Medium
              },
              {
                  "Device": "android",
                  "Version": "3.0",
                  "Pattern": /android (\d+(?:\.\d+)+)/i,
                  "VersionOperator": CompareOperator.GreaterOrEqual,
                  "Resolution": 800,
                  "ResolutionOperator": CompareOperator.LessOrEqual,
                  "Level": QualityLevels.Low
              },
              {
                  "Device": "android",
                  "Version": "3.0",
                  "Pattern": /android (\d+(?:\.\d+)+)/i,
                  "VersionOperator": CompareOperator.LessThan,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "opera mini",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "opera mobi",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "opera tablet",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "blackberry",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "bada",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              },
              {
                  "Device": "mobile",
                  "Version": "",
                  "Pattern": "",
                  "VersionOperator": CompareOperator.DoNotCompare,
                  "Resolution": 0,
                  "ResolutionOperator": CompareOperator.DoNotCompare,
                  "Level": QualityLevels.Lowest
              }];




            function changeSubtitles(materialId, subtitle) {
                var retVal = materialId;
                var hasParenthesis = materialId.indexOf('(') != -1;
                if (hasParenthesis) {
                    var firstPosition = materialId.indexOf(',');
                    var secondPosition = materialId.lastIndexOf(',');
                    retVal = materialId.slice(0, firstPosition + 1) + subtitle + materialId.slice(secondPosition, materialId.length);
                }
                return retVal;
            }

            function changeTracks(materialId, track) {
                var retVal = materialId;
                var hasParenthesis = materialId.indexOf('(') != -1;
                if (hasParenthesis) {
                    var firstPosition = materialId.indexOf('(');
                    var secondPosition = materialId.indexOf(',');
                    retVal = materialId.slice(0, firstPosition + 1) + track + materialId.slice(secondPosition, materialId.length);
                }
                return retVal;
            }

            if (mediaType == MediaType.Video) {
                var derivative = id.indexOf('(') != -1 && id.indexOf(')') != -1;
                if (derivative) {

                    var posOfFirstBracket = id.indexOf('(');
                    var posOfComa = id.indexOf(',');
                    var posOfSecondBracket = id.indexOf(')');
                    track = id.slice(posOfFirstBracket + 1, posOfComa);
                    subtitle = id.slice(posOfComa + 1, posOfSecondBracket);
                    id = id.slice(0, posOfFirstBracket);
                }
            }


            var allowVttSubtitles = true;
            var agent = navigator.userAgent.toLowerCase() || '';
            for (i = 0; i < Devices.length; i++) {
                var device = Devices[i];
                if (device.Device) {
                    if (agent.indexOf(device.Device) > -1) {
                        var proper = true;

                        if (device.Contains) {
                            proper = agent.indexOf(device.Contains) > -1;
                        }
                        if (proper)
                            if (device.DoNotContain) {
                                proper = agent.indexOf(device.DoNotContain) == -1;
                            }
                        if (proper) {
                            if (device.VersionOperator != CompareOperator.DoNotCompare) {
                                if (device.Pattern) {
                                    var version = agent.match(device.Pattern);
                                    if (version && version.length > 1) {
                                        version = version[1];
                                        if (version) {
                                            switch (device.VersionOperator) {
                                                case CompareOperator.DoNotCompare:
                                                    ;
                                                    break;
                                                case CompareOperator.Equals:
                                                    proper = (version == device.Version);
                                                    break;
                                                case CompareOperator.LessThan:
                                                    proper = (version < device.Version);
                                                    break;
                                                case CompareOperator.GreaterThan:
                                                    proper = (version > device.Version);
                                                    break;
                                                case CompareOperator.LessOrEqual:
                                                    proper = (version <= device.Version);
                                                    break;
                                                case CompareOperator.GreaterOrEqual:
                                                    proper = (version >= device.Version);
                                                    break;
                                                default:
                                                    ;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (proper) {
                            if (device.ResolutionOperator != CompareOperator.DoNotCompare) {
                                var resolution = Math.max(screen.height, screen.width);
                                switch (device.ResolutionOperator) {
                                    case CompareOperator.DoNotCompare:;
                                        break;
                                    case CompareOperator.Equals: proper = (resolution == device.Resolution);
                                        break;
                                    case CompareOperator.LessThan: proper = (resolution < device.Resolution);
                                        break;
                                    case CompareOperator.GreaterThan: proper = (resolution > device.Resolution);
                                        break;
                                    case CompareOperator.LessOrEqual: proper = (resolution <= device.Resolution);
                                        break;
                                    case CompareOperator.GreaterOrEqual: proper = (resolution >= device.Resolution);
                                        break;

                                    default:;
                                }

                            }
                        }
                        if (proper && mediaType == MediaType.Video) {

                            if(device.Level < level)
                                level = device.Level;
                            allowVttSubtitles = !device.DisallowVTTSubtitles;
                            break;
                        }
                    }
                }
            }


            var result = [];
            if (mediaType == MediaType.Video) {
                var highest_level_available = getHighestVideoLevel(profiles[firstType]);
                result.maxQualityLevel = highest_level_available;
                if (highest_level_available < level) {
                    result.maxQualityLevel = highest_level_available;
                    level = highest_level_available;
                }
            }
            else {
                result.maxQualityLevel = 1;
            }

            if (result.maxQualityLevel > 0) {
                result[firstType] = id + profiles[firstType][level];
                result[secondType] = id + profiles[secondType][level];

                if (mediaType == MediaType.Video) {
                    if (track) {
                        result[firstType] = changeTracks(result[firstType], track);
                        result[secondType] = changeTracks(result[secondType], track);
                    }
                    if (subtitle) {
                        result[firstType] = changeSubtitles(result[firstType], subtitle);
                        result[secondType] = changeSubtitles(result[secondType], subtitle);
                    }
                }


                result[firstType] = { id: result[firstType], url: UrlUtil.BuildUrl(result[firstType], UrlType.Material) };
                result[secondType] = { id: result[secondType], url: UrlUtil.BuildUrl(result[secondType], UrlType.Material) };

                if (mediaType == MediaType.Video) {
                    result.allowVttSubtitles = allowVttSubtitles;
                    result.vttTracks = vttSubtitles;
                }



                result.duration = -1;
                result.url = result[firstType].url;

            }

            return result;
        }
    }

})();

function createMediaPlayer(container, id, settings, isVideo) {

    if (isVideo !== false) {
        isVideo = true;
    }

   var logoImg = "data:image/png;base64,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";
   var _this_ = this;

   this.Player = null;
   this.MaterialId = id;
   this.aspectRatio = 1.78;
   this.container = container;
   this.availableProfiles = null;
   this.availableVttSubtitles = null;
   this.currentMedia = null;
   this.currentQualityLevel = 720;

   var maxQualityLevel = 1080;
   var currentAudioQualityLevel = 1;
   var currentTrack = 0;
   var currentSubtitle = "";
   var currentTime = 0;
   var currentDuration = 0;
   var lastTime = 0;
   var allowVttSubtitles = true;


    var defaultVideoSettings =
    {
        altAudio: 0,
        subtitles: [],
        vttTracks: null,
        ancestor: '',
        fullscreen: false,
        autoplay: false,
        starttime: 0,
        poster: '',
        generatehtml: true,
        timeline: false,
        error_distribution: 'http://av.epodreczniki.pl/epodreczniki/images/distribution.jpg',
        error_absent: 'http://av.epodreczniki.pl/epodreczniki/images/absent.jpg',
        error_noway: 'http://av.epodreczniki.pl/epodreczniki/images/noway.jpg',
        aspectRatio: 1.77778,
        Debug: false,
        loadMetadada: "dynamic",
        autoHideNavigation: true,
        canPlayCallback: null,
        simpleAudioMode: false,
        showTranscrptionCallback: null,
        transcrptionId : ""
    }

    var EventKeys =
    {
        Control: 17,
        Pause: 19,
        Home: 36,
        Escape: 27,
        Space: 32,
        Enter: 13,
        Backspace: 8,
        Up: 38,
        Down: 40
    }

    var FullScreen =
    {
        Yes: true,
        No: false
    }


    // metadata object



    function LogToConsole(msg) {
        if (msg)
            if (console)
                if (console.log) {
                    console.log(msg);
                }
    }




    this.SetNewMedia = function(mediaId)
    {
        _this_.MaterialId = mediaId;

        getMetadataInfo(mediaId, isVideo);
    }



    this.FillVideoQualities = function (qualityCombo, profiles, level, currentLevel) {
       
        var ul = qualityCombo.find('ul');
        ul.find(".dropup-menu-item").remove();

        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="1080" href="#">Najwyższa</a></li>');
        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="720" href="#">Wysoka</a></li>');
        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="360" href="#">Średnia</a></li>');
        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="270" href="#">Niska</a></li>');

        if (profiles && (profiles['mp4'] || profiles['webm'])) {
            qualityCombo.find("ul li a").each(function () {
                var val = $(this).data('level');

                if (val > level) {
                    $(this).parent().remove();
                }
            });
        }
        qualityCombo.find("[data-level=" + currentLevel + "] ").parent().addClass('active');

        ul.find("a").click(function () {
            qualityCombo.find('li').removeClass('active');
            $(this).parent().addClass('active');
            OnQualityTrackChange(qualityCombo);
        });
    }

    this.FillAudioQualities = function (qualityCombo, profiles, level, currentLevel) {
        var ul = qualityCombo.find('ul');
        ul.find(".dropup-menu-item").remove();

        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="1" href="#">Wysoka</a></li>');
        ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-level="0" href="#">Niska</a></li>');


        qualityCombo.find("ul li a").each(function () {
            var val = $(this).data('level');

            if (val > level) {
                $(this).parent().remove();
            }
        });

        qualityCombo.find("[data-level=" + currentLevel + "] ").parent().addClass('active');

        ul.find("a").click(function () {
            qualityCombo.find('li').removeClass('active');
            $(this).parent().addClass('active');
            OnAudioQualityTrackChange(qualityCombo);
        });
    }


    this.SetVideoQuality = function(level)
    {
        var qualityCombo = $(_this_.container).find('.qualityTracks');
        qualityCombo.find('li').removeClass('active');
        qualityCombo.find("[data-level=" + level + "] ").parent().addClass('active');
        _this_.currentQualityLevel = level;
    }

    this.FillSubtitlesTracks = function (subtitleTracks) {
        var subtitleCombo = $(this.container).find('.subtitleTracks');

        if (subtitleTracks.length == 0) {
            subtitleCombo.hide();
        } else {
            subtitleCombo.show();
        }


        var ul = $(this.container).find('.subtitleTracks ul');// subtitleCombo.find('ul');
        ul.find(".dropup-menu-item").remove();
        ul.append('<li role="presentation" class="active dropup-menu-item"><a tabindex="-1" data-val="" href="#">Brak</a></li>');

        for (var i = 0; i < subtitleTracks.length; i++) {
            if (subtitleTracks[i] == 'captions' || subtitleTracks[i].kind == 'captions')
            {
                ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-val="captions" href="#">Napisy dla niesłyszących</a></li>');

            } else 
            if (subtitleTracks[i] == 'subtitles' || subtitleTracks[i].kind == 'subtitles') {
                ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-val="subtitles" href="#">Napisy</a></li>');

            } else if (i == 0) {
                ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-val="captions" href="#">Napisy dla niesłyszących</a></li>');
            } else if ( i == 1 ) {
                ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-val="subtitles" href="#">Napisy</a></li>');
            }
        }

        ul.find("a").click(function () {
            subtitleCombo.find('li').removeClass('active');
            $(this).parent().addClass('active');
            if (settings.vttTracks != null && allowVttSubtitles) {
                OnChangeVttTrack();
            } else {
                OnSubtitleTrackChange(subtitleCombo);
            }

        });
    }

    this.FillAudioTracks = function (audioTracks) {
        var audioCombo = $(this.container).find('.audioTracks');
        var ul = audioCombo.find('ul');
        ul.find(".dropup-menu-item").remove();

        ul.append('<li role="presentation" class="active dropup-menu-item"><a tabindex="-1" data-val="" href="#">Oryginalna</a></li>');

        if (audioTracks > 0) {
            audioCombo.show();
            ul.append('<li role="presentation" class="dropup-menu-item"><a tabindex="-1" data-val="1" href="#">Audiodeskrypcja</a></li>');

            ul.find("a").click(function () {
                audioCombo.find('li').removeClass('active');
                $(this).parent().addClass('active');
                OnAudioTrackChange(audioCombo);
            });

        }
        else
            audioCombo.hide();

    }


    this.setQualityTracks = function (profiles) {

        var qualityCombo = $(_this_.container).find('.qualityTracks');
        if (qualityCombo.length > 0) {
            qualityCombo.show();
            if(isVideo)
                _this_.FillVideoQualities(qualityCombo, _this_.availableProfiles, maxQualityLevel, _this_.currentQualityLevel);
            else
                _this_.FillAudioQualities(qualityCombo, _this_.availableProfiles, maxQualityLevel, currentAudioQualityLevel);

        }
    }

    this.OnSetNewMetadata = function (id, metadata, updatedProfiles, vttSubtitles) {


        function UpdateVttTrack(id, md) {
            var first = true;
            var result = [];
            if (md.Subtitles) {
                $.each(md.Subtitles, function (key, value) {
                    var sub = { label: value, srclang: "pl", src: "" };
                    sub.src = UrlUtil.BuildUrl(id + '_' + value, UrlType.Subtitle);
                    if (first) {
                        sub.kind = "subtitles";
                    } else {
                        sub.kind = "captions";
                    }
                    result.push(sub);
                    first = false;
                });
            }
            return result;
        }

        vttSubtitles = UpdateVttTrack(id, metadata);

        updatedProfiles = UrlUtil.UpdateProfilesList(metadata);


        _this_.availableProfiles = updatedProfiles;
        _this_.availableVttSubtitles = vttSubtitles;


        if (isVideo) {
            mediaSources = createVideoSource(id, _this_.currentQualityLevel, _this_.availableProfiles, _this_.availableVttSubtitles);
        }
        else {
            mediaSources = createAudioSource(id, 1, _this_.availableProfiles);
        }

        allowVttSubtitles = CheckIfAnyVttTracksAvailable() && mediaSources.allowVttSubtitles;

        if (!allowVttSubtitles)
            settings.vttTracks = null;
        else if (mediaSources.vttTracks) {
            if (!settings.vttTracks)
                settings.vttTracks = mediaSources.vttTracks;
            else if (!settings.vttTracks.precedence) //PG 20140221
                settings.vttTracks = mediaSources.vttTracks;
        }
        maxQualityLevel = mediaSources.maxQualityLevel;
        setDurtion(metadata.Duration);

        if (metadata.Duration != undefined)
            mediaSources.duration = metadata.Duration;

        if (allowVttSubtitles) {
            if (mediaSources.vttTracks) {
                settings.vttTracks = mediaSources.vttTracks;
            }
        } else {
            settings.vttTracks = null;
        }


        if (isVideo) {
            _this_.FillAudioTracks(metadata.AltAudio);
            _this_.FillSubtitlesTracks(metadata.Subtitles);
        }
        _this_.setQualityTracks(metadata.Profiles);

        if (updatedProfiles != null)
            PlayWithNewUrl(0);
        else
            PlayError(settings.error_absent);

    }

    this.getMediaElement = function () {
        
        var el = null;
        var o = $(_this_.container).find('video');
        if (o.length == 0)
            o = $(_this_.container).find('audio');

        if (o.length > 0) {
            el = o[0];
        }

        return el;
    }

    function LogToConsole(msg) {
        if (settings.Debug) {
            if (msg)
                if (console)
                    if (console.log) {
                        console.log(msg);
                    }
        }
    }

    function isAssigned(obj) {
        if (obj)
            return true;
        return (obj != null);
    }

    function getPlayer(selector) {
        return $(selector).jPlayer()[0];
    }

    function isHtml5VideoSupported() {
        var v = document.createElement('video');
        if (v) {
            if (v.canPlayType)
                return v.canPlayType('video/webm') || v.canPlayType('video/mp4');
        }
        return false;
    }

    function CheckIfAnyVttTracksAvailable() {
        var video = _this_.getMediaElement();
        if (video) {
            if(video.textTracks === undefined)
                return false;
            return true;
        }
        return false;
    }


    function createVideoElements(id, fullscreenMode) {
        var playerHTML = '<img src="' + logoImg + '" class="jlogo"/>'
        + '<img src="javascript:void(0)" class="jlogo"><div class="jp-type-single"><div id="{0}_jplayer" name="jplayer" class="jp-jplayer"></div><div class="jp-video-play"><div role="button" class="jp-video-play-icon" tabindex="1">play</div></div><div class="jp-gui"><div class="jp-interface"><ul class="jp-controls"><li><div role="button" class="jp-play" title="Odtwórz" tabindex="1">Odtwórz</div></li><li><div role="button" class="jp-pause" title="Pauza" tabindex="1">Pauza</div></li><li><div role="button" class="jp-stop" title="Stop" tabindex="1">Stop</div></li></ul><div class="jp-settings"><div role="button" class="jp-full-screen jp-settings-btn" tabindex="1" title="pełny ekran">Pełny ekran</div><div role="button" class="jp-restore-screen jp-settings-btn" tabindex="1" title="wyłącz pełny ekran">Zakończ tryb pełnoekranowy</div><div class="dropdown" style="position:relative"><div role="button" class="jp-quality-select jp-settings-btn" title="ustawienia" data-toggle="dropup" role="button">Ustawienia <span class="caret"></span></div><ul class="dropdown-menu"><li><div class="menu-header">Ustawienia</div></li><li class="qualityTracks"><a class="trigger right-caret" data-toggle="dropup">Jakość</a><ul class="sub-menu" aria-labelledby="qLabel"></ul></li><li class="audioTracks"><a class="trigger right-caret" data-toggle="dropup">Ścieżki audio</a><ul class="sub-menu" aria-labelledby="aLabel"></ul></li><li class="subtitleTracks"><a class="trigger right-caret" data-toggle="dropup">Napisy</a><ul class="sub-menu" aria-labelledby="sLabel"></ul></li><li class="transcription"><a>Transkrypcja</a></li></ul></div><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div><div role="button" class="jp-mute jp-settings-btn" tabindex="1" title="Wycisz">Wycisz</div><div role="button" class="jp-unmute jp-settings-btn" tabindex="1" title="Dźwięk">Dźwięk</div></div><div class="jp-progressbar"><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-current-time"></div><div class="jp-duration"></div></div></div></div><div class="jp-no-solution"><span>Problem z odtwarzaniem</span>W bieżącej przeglądarce nie ma możliwości odtwarzania materiału video.</div></div>';

        $(id).html(playerHTML.format(id.substring(1)));
        $(id).addClass('jp-video');
        if (fullscreenMode)
            $(id).addClass('jp-video-full');
        else
            $(id).addClass('jp-video-100');
    }

    function createAudioElements(id) {
        var playerHtml = '<div class="jp-type-single"><div id="{0}_jplayer" name="jplayer" class="jp-jplayer"></div><div class="jp-gui"><div class="jp-interface"><ul class="jp-controls"><li><div role="button" class="jp-play" title="Odtwórz" tabindex="1">Odtwórz</div></li><li><div role="button" class="jp-pause" title="Pauza" tabindex="1">Pauza</div></li><li><div role="button" class="jp-stop" title="Stop" tabindex="1">Stop</div></li></ul><div class="jp-settings"><div class="dropdown" style="position:relative"><div role="button" class="jp-quality-select jp-settings-btn" title="ustawienia" data-toggle="dropup" role="button">Ustawienia <span class="caret"></span></div><ul class="dropdown-menu"><li><div class="menu-header">Ustawienia</div></li><li class="qualityTracks"><a class="trigger right-caret" data-toggle="dropup">Jakość</a><ul class="sub-menu" aria-labelledby="qLabel"></ul></li></ul></div><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div><div role="button" class="jp-mute jp-settings-btn" tabindex="1" title="Wycisz">Wycisz</div><div role="button" class="jp-unmute jp-settings-btn" tabindex="1" title="Dźwięk">Dźwięk</div></div><div class="jp-progressbar"><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-current-time"></div><div class="jp-duration"></div></div></div></div><div class="jp-no-solution"><span>Problem z odtwarzaniem</span>W bieżącej przeglądarce nie ma możliwości odtwarzania materiału video.</div></div>';
        $(id).html(playerHtml.format(id.substring(1)));
        $(id).addClass('jp-audio');
    }


    function FormatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }

    function setDurtion(dur)
    {
        var durTxt = '00:00';
        if (dur != undefined && dur > 0)
        {
            dur = Math.floor(dur / 1000);
            var min = Math.floor(dur / 60);
            var sec = dur % 60;
            durTxt = FormatNumberLength(min, 2) + ":" + FormatNumberLength(sec, 2);
        }

        $(_this_.container).find('.jp-duration').html(durTxt);
        currentDuration = dur;
    }



    function OnAudioTrackChange(audioCombo) {
        currentTrack = audioCombo.find("li.active a").data('val');
        PlayWithNewUrl();
    }

    function OnQualityTrackChange(qualityCombo) {
        _this_.currentQualityLevel = qualityCombo.find("li.active a").data('level');
        PlayWithNewUrl();
    }

    function OnAudioQualityTrackChange(qualityCombo) {
        currentAudioQualityLevel = qualityCombo.find("li.active a").data('level');
        PlayWithNewUrl();
    }


    function OnSubtitleTrackChange(subtitleCombo) {
        currentSubtitle = subtitleCombo.find("li.active a").data('val');
        PlayWithNewUrl();
    }

    function OnChangeVttTrack() {
        var subtitleCombo = $(container).find('.subtitleTracks');

        currentSubtitle = subtitleCombo.find("li.active a").data('val');

        var video = _this_.getMediaElement();
        var allTracks = video.textTracks;
        if (allTracks) {
            for (var i = 0; i < allTracks.length; i++) {
                if (currentSubtitle === allTracks[i].label)
                    allTracks[i].mode = allTracks[i].SHOWING || 'showing';
                else if (currentSubtitle === '')
                    allTracks[i].mode = allTracks[i].OFF || 'disabled';
                else
                    if (i == currentSubtitle) {
                        allTracks[i].mode = allTracks[i].SHOWING || 'showing';
                    } else {
                        allTracks[i].mode = allTracks[i].OFF || 'disabled';
                    }
            }
        }
    }



    function PlayWithNewUrl(play_pos)
    {
        var media_el = _this_.getMediaElement();

        var id = _this_.MaterialId;

        var isPlaying = media_el.currentTime > 0.0 && !media_el.paused;
        var mediaSources;

        if (isVideo) {

            mediaSources = createVideoSource(id,
                _this_.currentQualityLevel,
                _this_.availableProfiles,
                _this_.availableVttSubtitles,
                currentTrack,
                allowVttSubtitles ? false : currentSubtitle);
        }
        else
        {
            mediaSources = createAudioSource(id, currentAudioQualityLevel, _this_.availableProfiles );
        }

        if (mediaSources.maxQualityLevel == 0)
        {
            PlayError(settings.error_distribution);
            return;
        }

        if (play_pos === undefined)
            lastTime = media_el.currentTime;
        else
            lastTime = play_pos;


        if(isVideo)
        {
            var timestamp = new Date().getTime();
            var urlmp4 = mediaSources['mp4'].url + '#' + timestamp;

            _this_.currentMedia = {
                m4v: urlmp4,
                webmv: mediaSources['webm'].url,
                poster: settings.poster,
                track: settings.vttTracks
            };
            _this_.Player.jPlayer("setMedia", _this_.currentMedia);
        }
        else
        {
            _this_.currentMedia = {
                m4a: mediaSources['mp4'].url,
                oga: mediaSources['ogg'].url
            };
            _this_.Player.jPlayer("setMedia", _this_.currentMedia);
        }

        if (allowVttSubtitles) {
            OnChangeVttTrack();
        }

        if (isPlaying) {
            _this_.Player.jPlayer("play");
            if (lastTime > 0) {
                _this_.Player.jPlayer("play", lastTime);               
            }
            else {
                _this_.Player.jPlayer("play");
            }
        }
        else
        {
            if (media_el.paused && media_el.currentTime > 0)
                _this_.Player.jPlayer("playHead", (lastTime * 100) / currentDuration);
        }
    }

    function PlayError(errorImg)
    {
        
        if (isVideo) {
            _this_.Player.jPlayer("setMedia",
                {
                    m4v: "",
                    webmv: "",
                    poster: errorImg
                });

            _this_.Player.jPlayer("option", "errorState", true)

            $(container).find(".jp-video-play").hide();
            $(container).find(".jp-gui").hide();
        }
    }

  

    function createAudioSource(id, level, profiles) {
        return UrlUtil.BuildMediaSource(MediaType.Audio, String(id), level, profiles);
    }
      
    function createVideoSource(id, level, profiles, vttSubtitles, track, subtitle) {
        return UrlUtil.BuildMediaSource(MediaType.Video, String(id), level, profiles, vttSubtitles, track, subtitle);
    }


    function getMetadataInfo(id, isVideo) {

        var metadata = new Metadata(id, isVideo);

        if (settings.subtitles)
            metadata.Subtitles = settings.subtitles;
        if (settings.altAudio > 0)
            metadata.AltAudio = 1;

        var updatedProfiles;
        var vttSubtitles;

        var path = UrlUtil.BuildUrl(id, UrlType.Metadata);
        if (settings.loadMetadada == "dynamic") {
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

                    $.extend(metadata, data);

                    _this_.OnSetNewMetadata(id, metadata, updatedProfiles, vttSubtitles);

                },
                error: function (jqXHR, textStatus, error) {
                    if (jqXHR.status === 0) {
                        LogToConsole('Cannot connect. Verify network.');
                    } else if (jqXHR.status == 403) {
                        metadata.AllowDistribution = false;
                        LogToConsole('Access denied [403]');
                    } else if (jqXHR.status == 404) {
                        LogToConsole('Requested page not found [404]');
                    } else if (jqXHR.status == 500) {
                        LogToConsole('Internal Server Error [500].');
                    }
                    if (textStatus === 'parsererror') {
                        LogToConsole('Parsing JSON failed.');
                    } else if (textStatus === 'timeout') {
                        LogToConsole('Time out.');
                    } else if (textStatus === 'abort') {
                        LogToConsole('Ajax request aborted.');
                    } else {
                        LogToConsole('Uncaught Error: ' + jqXHR.responseText);
                    }
                    _this_.OnSetNewMetadata(id, metadata, null, null);
                }
            });
        }
        else {
            _this_.OnSetNewMetadata(id, metadata, updatedProfiles, vttSubtitles);
        }
    }



    var div = container + ' [name="jplayer"]';
    settings = $.extend({}, defaultVideoSettings, settings);
    settings.ancestor = container;

    if (settings.generatehtml) {
        if (isVideo)
            createVideoElements(container, settings.fullscreen);
        else
            createAudioElements(container);
    }

    var width = $(container).width();

    if (isVideo) {
        this.aspectRatio = settings.aspectRatio;

        var playerCssClass = 'jp-video-100';
        var playerWidth = "100%";
        var playerHeight = width / this.aspectRatio;
        $(container).find('.jp-video-play').css({ 'margin-top': '-' + playerHeight + 'px', 'height': playerHeight + 'px' });
        $(container).get(0).aspectRatio = this.aspectRatio;

        if (settings.fullscreen) {
            playerCssClass = 'jp-video-full';
            var playerWidth = "100%";
            var playerHeight = "100%";
        }
    }

    if (isVideo == false)
        settings.autoHideNavigation = false;


    var options =
    {
        canPlayCallback: settings.canPlayCallback,
        container: container,
        preload: 'none',
        cssSelectorAncestor: settings.ancestor,
        fullScreen: settings.fullscreen,
        //fullWindow: settings.fullscreen,
        solution: "html",
        autohide: { restored: settings.autoHideNavigation, hold: 3000 },
        keyEnabled: true,
        simpleAudioMode: settings.simpleAudioMode,
        keyBindings:
        {
            controls:
            {
                key: EventKeys.Control,
                fn: function (f) {
                    f.htmlElement.video.controls = false;
                }
            },
            play:
            {
                key: EventKeys.Space,
                fn: function(f) {
                    if (f.status.paused) {
                        f.play();
                    } else {
                        f.pause();
                    }
                }
            },
            pause:
            {
                key: EventKeys.Pause,
                fn: function(f) {
                    if (f.status.paused) {
                        f.play();
                    } else {
                        f.pause();
                    }
                }
            },
            fullScreen:
            {
                key: EventKeys.Enter,
                fn: function(f) {
                    if (f.status.video || f.options.audioFullScreen) {
                        f._setOption("fullScreen", !f.options.fullScreen);
                    }
                }
            },
            restoreScreen:
            {
                key: EventKeys.Escape,
                fn: function(f) {
                    if (f.options.fullScreen)
                        f._setOption("fullScreen", false);
                }
            },
            muted:
            {
                key: EventKeys.Backspace,
                fn: function(f) {
                    f._muted(!f.options.muted);
                }
            },
            volumeUp:
            {
                key: EventKeys.Up,
                fn: function(f) {
                    f.volume(f.options.volume + 0.1);
                }
            },
            volumeDown:
            {
                key: EventKeys.Down,
                fn: function(f) {
                    f.volume(f.options.volume - 0.1);
                }
            }
        },
        noFullWindow:
        {
            android_pad: '',
            android_phone: '',
            blackberry: /blackberry/,
            webos: /webos/
        },
        ended: function (event) {
            console.log('ended');

            $(container).find(".jp-video-play").show();

            if (_this_.currentMedia) {
                _this_.Player.jPlayer("setMedia", _this_.currentMedia);
            }
        },
        play: function () {
            //console.log('play');
            $(container).find(".jp-video-play").hide();

            $(this).attr("playing", "");


            if (allowVttSubtitles) {
                OnChangeVttTrack();
            }
        },
        pause: function()
        {
            //console.log('pause');
        },
        loadeddata: function () {
            //console.log('loadeddata');
        },
        canplay: function () {
            var video = _this_.getMediaElement();

            //console.log('canplay');
        },
        canplaythrough: function () {
            //console.log('canplaythrough');
        },
        playing: function () {
            //console.log('playing');
        },
        waiting: function () {
            //console.log('waiting');
        },
        seeking: function () {
            //console.log('seeking');
        },
        seeked: function () {
            //console.log('seeked');
        },
        abort: function () {
            //console.log('abort');
        },
        progress: function () {
            //var v = _this_.getMediaElement();
            //if(v.buffered.length > 0)
            //    console.log('progress ' + v.buffered.end(0));
        },
        resize: function(event) {
            if (event.jPlayer.status.height == "100%") {
                $('body').addClass('hide-scrollbars');
            } else {
                $('body').removeClass('hide-scrollbars');
            };
        },
        error: function (event) {
            var video = _this_.getMediaElement();
            console.log('error: ' + event.jPlayer.error.type + ' networkState:' + video.networkState);
            switch (event.jPlayer.error.type) {
                case $.jPlayer.error.URL:
                    if (video.networkState == 3) {
                        if (_this_.currentMedia != null) {
                            var newMedia = event.jPlayer.status.media;
                            newMedia.poster = settings.error_distribution;
                            $(this).jPlayer("setMedia", newMedia);
                        }
                        else
                            $(container).find(".jp-video-play").hide();
                    }
                    else {
                        if (settings.loadMetadada == "dynamic") {
                            if (_this_.currentQualityLevel == 360) {
                                _this_.SetVideoQuality(270);
                                PlayWithNewUrl();
                                setTimeout(_this_.Player.jPlayer("play"), 100);
                            }
                            if (_this_.currentQualityLevel == 720) {
                                _this_.SetVideoQuality(360);
                                PlayWithNewUrl();
                                setTimeout(_this_.Player.jPlayer("play"), 100);
                            }
                        }
                    }
                    break;
                case $.jPlayer.error.URL_NOT_SET:
                    LogToConsole("Nie podano materiału do odtworzenia!");
                    break;
                case $.jPlayer.error.NO_SOLUTION:
                    LogToConsole("Odtwarzanie materiałów jest niemożliwe: " + event.jPlayer.html);
                    break;
                case $.jPlayer.error.NO_SUPPORT:
                    LogToConsole("Odtworzenie podanego materiału nie jest możliwe: " + event.jPlayer.status.src);
                    break;
            }
        },
        ready: function (event) {
            if (isVideo) {
                $(container).find(".jp-interface").addClass("jp-interface-autohide");

                if (settings.fullscreen)
                    _this_.Player.jPlayer("option", "fullScreen", true);
            }

            $(container).find(".jp-stop").click(function () {
                $(container).find(".jp-video-play").show();

                if (_this_.currentMedia) {
                    _this_.Player.jPlayer("setMedia", _this_.currentMedia);
                }
            });
            _this_.getMediaElement().controls = false;
        },
        supplied: isVideo ? "m4v, webmv" : "m4a, oga",
        size:
        {
            width: playerWidth,
            height: playerHeight,
            cssClass: playerCssClass
        },
        timeupdate : function(event)
        {
            currentTime = event.jPlayer.status.currentTime;
        }
    }


    this.Player = $(div).jPlayer(options);


    $(div).find('video').attr('crossorigin', 'anonymous');


    if (!settings.showTranscrptionCallback) {
        $(container).find(".transcription").hide();

    }
    else {
        $(container).find(".transcription a").click(function () {
            settings.showTranscrptionCallback(settings.transcrptionId);
        });
    }


    getMetadataInfo(id, isVideo);


}

function createSimpleAudioPlayer(parent, id, canPlay, playelem) {
    var settings = {};
    settings.generatehtml = false;
    settings.loadMetadada = 'static';
    settings.simpleAudioMode = true;
    settings.canPlayCallback = canPlay;

    var html = '<div name="jplayer"></div>';
    $(parent).append(
        html
    );

    var player = new createMediaPlayer(parent, id, settings, false);

    var playelement = "#";
    if (playelem) {
        playelement +=playelem;
    } else {
        playelement =parent;
    }
    var media = player.getMediaElement();

    media.onplay = function () {
        $(playelement).attr("playing", "");
    };
    media.onpause = function () {
        $(playelement).removeAttr("playing");
    };

    $(playelement).click(function () {
        if (media != null) {
            if (media.paused) {
                player.Player.jPlayer("play");
            }
            else {
                player.Player.jPlayer("pause");
            }
        }
    });

    player.Player.bind($.jPlayer.event.ended, function(event){
        $(playelement).removeAttr("playing");
    });

    $(playelement).css('cursor', 'pointer');

    return player;
}

function updatePlayerSize()
{
    $('.jp-video').each(function (i, playerContainer) {
        var _playerContainer = $(playerContainer);
        var div = _playerContainer.get(0);
        var w = _playerContainer.innerWidth();
        var aspectRatio = div.aspectRatio;

        if (!_playerContainer.hasClass('jp-video-full')) {
            var playerHeight = _playerContainer.find('.jp-jplayer').height(w / aspectRatio).width(w).find('img').height(w / aspectRatio).width(w).height();
            _playerContainer.find('.jp-video-play').css({ 'margin-top': '-' + playerHeight + 'px', 'height': playerHeight + 'px' });
        }
    });
}

function createPlayer(div, canPlay, loadMetadada)
{
    if (loadMetadada === undefined) {
        loadMetadada = 'static';
    }

    var _div = $(div);
    var id = _div.attr('id');
    var mediatype = _div.data("mediatype");
    var materialId = _div.data('mid').toString();
    var aspectratio = _div.data('aspectratio');
    var subtitles = _div.data('subtitles');
    var altaudio = _div.data('altaudio');
    var playelem = _div.data('playelem');
    var poster = _div.data('poster');

    if (subtitles !== undefined && subtitles.length > 0)
    {
        subtitles = subtitles.split(",");
    }

    var container = "#" + id;

    if (mediatype == "video" && materialId)
    {
        if (aspectratio === undefined) {
            aspectratio = 1.78;
        }

        if (subtitles === undefined || subtitles.length == 0) {
            subtitles = [];
        }
        if (altaudio === undefined) {
            altaudio = 0;
        }
        var settings = { generatehtml: true, autoplay: false, canPlayCallback: canPlay, aspectRatio: aspectratio, autoHideNavigation: true, loadMetadada: loadMetadada, altAudio: altaudio, subtitles: subtitles, poster: poster };
        var player = new createMediaPlayer(container, materialId, settings, true);

        return player;
    }


    if (mediatype == "audio" && materialId) {

        var settings = { generatehtml: true, autoplay: false, canPlayCallback: canPlay, loadMetadada: loadMetadada };
        return new createMediaPlayer(container, materialId, settings, false);
    }

    if (mediatype == "simple-audio" && materialId) {
        return createSimpleAudioPlayer(container, materialId, canPlay, playelem);
    }

    return null;
}

    return {
        createSimpleAudioPlayer: createSimpleAudioPlayer,
        createVideoPlayer: function (container, id, settings) {
            return new createMediaPlayer(container, id, settings, true);
        },
        createAudioPlayer: function (container, id, settings) {
            return new createMediaPlayer(container, id, settings, false);
        },

        updatePlayerSize: updatePlayerSize,
        createPlayer: createPlayer,
        playMedia: function (container) {
            var div = container + ' [name="jplayer"]';
            $(div).jPlayer("play");
        },
        buildMediaSource: function (mediaType, id) {
            return UrlUtil.BuildMediaSource(mediaType, String(id));
        },
        newBuildUrlFunc: function(func){
            UrlUtil.urlType = UrlType;
            UrlUtil.BuildUrl = func;
        }
    }
});