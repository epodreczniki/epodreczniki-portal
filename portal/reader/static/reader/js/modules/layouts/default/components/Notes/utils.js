define(['jquery', 'underscore'], function ($, _) {


    var colorList = function (start, stop, additionalClass) {
        var $colors = $('<div>');
        for (i = start; i <= stop; i++) {
            var $btn = $('<button>', {
                class: 'note-color-btn note-type' + i,
                'data-type': i
            });
            if (additionalClass) $btn.addClass(additionalClass);
            $colors.append($btn);
        }
        return $colors.html();
    };

    var searchSiteLogo = function searchSiteLogo(input) {
        var url = establishURL(input);
        if (url) {
            return '<img src="' + url + '/favicon.ico" alt="Logo strony">';
        }
        return '';
    };

    var searchImage = function searchImage(url) {
        var thumbnail_url;
        if (checkURLValid(url) && checkImageUrl(url)) {
            return '<img class="thumbnail" src="' + url + '" alt="Miniatura obrazu" >';
        }
        else if (url.search("instagram") > 0) {
            thumbnail_url = "http://instagram.com/p/" + url.split("/")[4] + "/media/?size=t";
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura obrazu" >';
        }
        else if (url.search("imgur") > 0) {
            thumbnail_url = "http://i.imgur.com/" + url.split("/")[4] + "m.jpg";
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura obrazu" >';
        }
        return "";

    };

    var searchVideo = function searchVideo(url) {
        var video_id;
        var video_title;
        var thumbnail_url = "";
        if (establishURL(url).search("youtube") > -1) { // YOUTUBE

            video_id = url.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            thumbnail_url = 'http://img.youtube.com/vi/' + video_id + '/default.jpg';
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura video">';
        }
        else if (establishURL(url).search("vimeo") > -1) { // VIMEO
            var vimeoVideoID = url.split('/')[5];
            $.getJSON('http://www.vimeo.com/api/v2/video/' + vimeoVideoID + '.json?callback=?', {format: "json"},
                function (data) {
                    thumbnail_url = data[0].thumbnail_small;
                });
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura video">';
        }
        else if (establishURL(url).search("dailymotion") > -1) { //DailyMotion
            video_id = url.split('/')[4];
            thumbnail_url = "http://www.dailymotion.com/thumbnail/video/" + video_id;
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura video">';

        }
        else if (establishURL(url).search("metacafe") > -1) { //METACAFE
            video_id = url.split('/')[4];
            video_title = url.split('/')[5];
            thumbnail_url = "http://s4.mcstatic.com/thumb/" + video_id + "/0/6/videos/0/6/" + video_title + ".jpg";
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura video">';
        }
        else if (establishURL(url).search("videobash") > -1) { //VIDEOBASH

            temp_tab = url.split("-");
            video_id = temp_tab[temp_tab.length - 1];
            video_id = video_id.lpad("0", 9);
            thumbnail_url = "http://cdn1.images.videobash.com/thumbs/" + video_id.substr(0, 3) + "/" +
                video_id.substr(3, 3) + "/" + video_id.substr(6, 3) + "/320x240/320x240_4.jpg";
            return '<img class="thumbnail" src="' + thumbnail_url + '" alt="Miniatura video">';
        }
        return "";

    };

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.substring(0, str.length) === str;
        }
    }

    String.prototype.lpad = function (padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    };

    function establishURL(url) {

        if (!url.startsWith("http"))
            url = "http://" + url;
        url = extractDomain(url);
        if (checkURLValid(url))
            return url;
        else
            return false;
    }

    function extractDomain(url) {
        var m = (url.match(/^http:\/\/[^/]+/) || url.match(/^https:\/\/[^/]+/));
        return m ? m[0] : null;

    }

    function checkImageUrl(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    function checkURLValid(url) {
        var regex = /(http|https):\/\/(\w+:?\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return regex.test(url);
    }

    var findUrl = function findUrl(text, tab) {
        var regex = /(http|https):\/\/(\w+:?\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (text.search(regex) < 0)
            return tab;
        else {
            var leftText = text.substr(text.search(regex));
            var full_url = leftText.substring(0, leftText.search(/<\/a>|<br|&nbsp;|\s|\n|($)/));
            tab.push(full_url);
            findUrl(leftText.substr(full_url.length), tab);
        }
    };

    var extractContent = function extractContent(document, selector) {
        var underDivElements = document.$(selector).contents();
        var value = '';
        for (var i = 0; i < underDivElements.length; i++) {
            if (underDivElements[i].nodeType == '3') {
                value += underDivElements[i].nodeValue;
            }
            else if (underDivElements[i].tagName == 'A') {
                var className = underDivElements[i].className;
                var nodeValue = underDivElements[i].firstChild.nodeValue;
                value += '<a class="' + className + '" >' + nodeValue + '</a>';
            }
            else if (underDivElements[i].className != 'thumbnail' && underDivElements[i].className != 'visible') {
                value += underDivElements[i].innerText;
            }

        }
        return value;
    }

    var shortenText = function shortenText(text, maxLength) {
        var ret = text;
        if (ret.length > maxLength) {
            ret = ret.substr(0, maxLength - 3) + "...";
        }
        return ret;
    };

    return {
        colorList: colorList,
        searchSiteLogo: searchSiteLogo,
        searchImage: searchImage,
        searchVideo: searchVideo,
        findUrl: findUrl,
        shortenText: shortenText,
        extractContent: extractContent
    };

});
