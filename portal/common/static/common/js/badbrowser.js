/**
 * Created with PyCharm.
 * User: martut
 * Date: 9/17/13
 * Time: 11:52 AM
 * To change this template use File | Settings | File Templates.
 */

// wish list
var validation_conditions = [
    ['Android', '0', 'firefox', '18.0'],
    ['IPhone', '0', 'Safari', '5.0'],
    ['IPad', '0', 'Safari', '5.0'],
    ['Android', '4', undefined, undefined],
    [undefined, undefined, "firefox", "18.0"],//22
    [undefined, undefined, "chrome", "24.0"],//28
    [undefined, undefined, "explorer", "10"],//10
    [undefined, undefined, 'safari', '6'],
    [undefined, undefined, "opera", '16.0']

];

var BrowserDetect = {
    set_user_aget: function (ua) {
        this.ua = ua;
    },
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || undefined;
        this.version = this.searchVersion(this.ua)
            || this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || undefined;
        this.OS = this.searchString(this.dataOS) || undefined;
        this.OSversion = this.searchVersion(this.ua) || this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || undefined;
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = this.ua || data[i].string;
            //console.log('dataString' + dataString);
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        if (dataString === undefined) {
            return undefined;
        }
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        var re = '^[0-9._]*';
        var ver = dataString.substring(index + this.versionSearchString.length + 1);
        return ver.match(re);
    },
    searchVersionOS: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        var re = '^[0-9._]*';
        var ver = dataString.substring(index + this.versionSearchString.length + 1);
        return ver.match(re);
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "OPR",
            identity: "Opera",
            versionSearch: "OPR"
        },
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {    string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        /*{
         string: window.opera,
         subString: "Opera",
         identity: "Opera",
         versionSearch: "Version/"
         },*/
        {
            string: navigator.userAgent,
            subString: "Opera",
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox",
            versionSearch: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {		// for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        { 		// for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS: [

        {
            string: navigator.userAgent,
            subString: "Android",
            identity: "Android",
            versionSearch: "Android"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone",
            versionSearch: "iPhone OS"
        },
        {
            string: navigator.userAgent,
            subString: "iPod",
            identity: "iPod",
            versionSearch: "iPod OS"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
        /*{
         string: navigator.platform,
         subString: "Win",
         identity: "Windows"
         },
         {
         string: navigator.platform,
         subString: "Mac",
         identity: "Mac"
         },
         {
         string: navigator.platform,
         subString: "Linux",
         identity: "Linux"
         }*/
    ]

};

browserVerification();

// for browser id string parsing and comparing with wish list tests
//tests();


function browserVerification() {
//	var user_agent = "Mozilla/5.0 (Linux; Ubuntu 14.04) AppleWebKit/537.36 Chromium/35.0.1870.2 Safari/537.36";
//	BrowserDetect.set_user_aget(user_agent);
    BrowserDetect.init();

    var skip_device_identification = false;
    if (BrowserDetect.OS === undefined || BrowserDetect.OS == '' || BrowserDetect.OSversion === undefined || BrowserDetect.OS == '') {
        skip_device_identification = true;
    }
    if (!verifay(validation_conditions, skip_device_identification)) {
        //alert('miejsce na redirect');
        // Redirect when browser not suported

        if ((window.localStorage !== undefined) && (window.localStorage.getItem('epo_skipbadbrowser') !== 'true')) {
            window.location = '/badbrowser';
            console.log('badbrowser detected!: ' + window.localStorage.getItem('epo_skipbadbrowser'));
        }
        else if ((window.localStorage === undefined) && (!docCookies.hasItem('epo_skipbadbrowser'))) {
            window.location = "/badbrowser";
            console.log('badbrowser detect - cookie');
        }
    } else {
       // console.log('pass');
    }
    //console.log(" >>>> Twoja przeglądarka to: " + BrowserDetect.browser + ", w wersji: " + BrowserDetect.version + ", na systemie: " + BrowserDetect.OS + " w wersji: " + BrowserDetect.OSversion);
}

/**
 * Simply compares two string version values.
 *
 * Example:
 * versionCompare('1.1', '1.2') => -1
 * versionCompare('1.1', '1.1') =>  0
 * versionCompare('1.2', '1.1') =>  1
 * versionCompare('2.23.3', '2.22.3') => 1
 *
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @function
 * @param {String} left  Version #1
 * @param {String} right Version #2
 * @return {Integer|Boolean}
 * @author Alexey Bass (albass)
 * @since 2011-07-14
 */

function versionCompare(left, right) {
    if (typeof left + typeof right != 'stringstring')
        return false;
    var a = left.split(/[._]/)
        , b = right.split(/[._]/)
        , i = 0, len = Math.max(a.length, b.length);

    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }
    return 0;
}

function checkElementName(a, b) {
    if (a === undefined || b === undefined) {
        return true;
    }
    if (a.toLowerCase() == b.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

function verifay(settings, skip_device_identification) {
    for (var i in settings) {
        var condition = settings[i];
        var platform = condition[0], platform_version = condition[1],
            browser = condition[2], browser_version = condition[3];
        if (!skip_device_identification && platform != undefined && platform_version != undefined) {
            if (checkElementName(platform, BrowserDetect.OS)) {
                if (parseInt(versionCompare('' + BrowserDetect.OSversion, '' + platform_version)) >= 0) {
                    if (checkElementName(browser, BrowserDetect.browser)) {
                        if (parseInt(versionCompare('' + BrowserDetect.version, '' + browser_version)) >= 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        } else if (skip_device_identification && platform === undefined && platform_version === undefined) {
            if (checkElementName(browser, BrowserDetect.browser)) {
                if (parseInt(versionCompare('' + BrowserDetect.version, '' + browser_version)) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
        } else if(!skip_device_identification && BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Safari" ){
        	return false;
        }
    }
    return true;
}

function test(user_agent) {
    BrowserDetect.set_user_aget(user_agent);
    BrowserDetect.init();
    var skip_device_identification = false;
    if (BrowserDetect.OS === undefined || BrowserDetect.OS == '' || BrowserDetect.OSversion === undefined || BrowserDetect.OS == '') {
        skip_device_identification = true;
    }
    console.log("Twoja przeglądarka to: " + BrowserDetect.browser + ", w wersji: " + BrowserDetect.version + ", na systemie: " + BrowserDetect.OS + " w wersji: " + BrowserDetect.OSversion);
    return verifay(validation_conditions, skip_device_identification);
}


function tests() {
    var user_agents_test_list = [
        ['Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36', true],
        ['Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:20.0) Gecko/20100101 Firefox/20.0', false],
        ['Mozilla/5.0 (Linux; U; Android 2.2.1; de-de; X2 Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', false],
        //chrome
        ['Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/24.0.1290.1 Safari/537.13', false],
        ['Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/24.0.1290.1 Safari/537.13', false],
        ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/24.0.1290.1 Safari/537.13', false],
        ['Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36', true],
        ['Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.17 Safari/537.36', true],
        //firefox
        ['Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0', true],
        ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0', true],
        ['Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:21.0) Gecko/20130331 Firefox/21.0', true],
        ['Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:22.0) Gecko/20130328 Firefox/22.0', true],
        ['Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:15.0) Gecko/20121011 Firefox/15.0.1', false],
        ['Mozilla/5.0 (Windows NT 6.2; Win64; x64;) Gecko/20100101 Firefox/20.0', false],
        ['Mozilla/5.0 (Windows NT 6.1; rv:15.0) Gecko/20120716 Firefox/15.0a2', false],
        //opera
        ['Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14', true],
        ['Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14', true],
        ['Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0) Opera 12.14', true],
        ['Mozilla/5.0 (Windows NT 6.1; U; nl; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.01', true],
        ['Mozilla/5.0 (Windows NT 6.1; U; de; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.01', true],
        ['Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; de) Opera 11.01', true],
        //safari
        ['Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25', true],
        ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2', false],
        ['Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27', false],
        ['Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4', false],
        // Iphone safari

        ['Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; th-th) AppleWebKit/533.17.8 (KHTML, like Gecko) Version/5.0.1 Safari/533.17.8', false],
        // Android
        ['Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30', true],
        ['Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30', true],
        ['Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9', false],
        ['Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; HTC_IncredibleS_S710e Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', false],
        ['Mozilla/5.0 (Linux; U; Android 2.2; fr-lu; HTC Legend Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', false],
        ['Mozilla/5.0 (Linux; U; Android 2.2.1; en-gb; HTC_DesireZ_A7272 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', false],
        // Iphone
        ['Mozilla/5.0 (iPhone; U; ru; CPU iPhone OS 4_2_1 like Mac OS X; fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5', true],
        ['Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B5097d Safari/6531.22.7', false],
        ['Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/123', false]
        //['',true]
    ];
    var poprawne = 0;
    var niepoprawne = 0;
    for (str in user_agents_test_list) {
        if (true) {
            var checkBrowser = test(user_agents_list[str][0], conditions) == user_agents_list[str][1];
            if (checkBrowser)
                poprawne = poprawne + 1;
            else
                niepoprawne = niepoprawne + 1;
        }
    }
    console.log("rozpoznanie i weryfikacja: poprawnych =" + poprawne + "  niepoprawne=" + niepoprawne);
}
