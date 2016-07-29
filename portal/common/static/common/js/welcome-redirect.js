/**
 * Created with PyCharm.
 * User: erwin
 * Date: 28.01.14
 * Time: 13:48
 * To change this template use File | Settings | File Templates.
 */

var WelcomeRedirectLocation = {
    MAIN: 0,
    PL: 1,
    EN: 2,
    DEF : 4
};

var WelcomeRedirect = {

    redirectTo: function () {
        if (typeof(Storage) !== "undefined") {
            var userLang = navigator.language || navigator.userLanguage;

//            if (localStorage.EPO_WELCOME) {
//                return WelcomeRedirectLocation.MAIN;
//            }
//            else {
                localStorage.EPO_WELCOME = 'welcome';

                if (userLang.match(/pl/)) {
                    return WelcomeRedirectLocation.PL;
                }
                else {
                    return WelcomeRedirectLocation.EN;
                }
//            }
        }
        else {
            return WelcomeRedirectLocation.DEF;
        }
    },

    restorePreviousPathFromLocalStorage: function () {

        if(localStorage.EPO_NAVIGATION)
        {
            return localStorage.EPO_NAVIGATION;
        }
        else
        {
            return '/front/no-filter';
        }
    },

    saveCurrentPath: function () {

        localStorage.EPO_NAVIGATION = window.location.pathname;
    }
};


function conditionalRedirect() {

    if(window.location.pathname.match(/front\/$/))
    {
        switch(WelcomeRedirect.redirectTo())
        {
            case WelcomeRedirectLocation.MAIN:
                window.location = WelcomeRedirect.restorePreviousPathFromLocalStorage();
                break;
            case WelcomeRedirectLocation.PL:
                window.location = "/front/welcome";
                break;
            case WelcomeRedirectLocation.EN:
                window.location = "/front/welcome_english";
                break;
            case WelcomeRedirectLocation.DEF:
                window.location = "/front/no-filter";
                break;
            default:
                window.location = "/front/no-filter";
                break;
        }
    }
    else if (window.location.pathname.match(/(no-filter$|subject|level)/))
    {
        WelcomeRedirect.saveCurrentPath();
    }
}

function switchInfoLang() {
        var w = WelcomeRedirect.redirectTo(), el;
        if(w == WelcomeRedirectLocation.PL){
            el = document.getElementById('welcome-en');
            el.parentNode.removeChild(el);
        }else{
            el = document.getElementById('welcome-pl');
            el.parentNode.removeChild(el);
        }
}

//Main program call

//conditionalRedirect();
switchInfoLang();


