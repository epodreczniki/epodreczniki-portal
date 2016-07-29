define(['jquery'], function ($) {
    'use strict';

    var readValue = function(key) {
        var res;
        if (window.localStorage !== undefined && key !== undefined && key !== null) {
            res = localStorage.getItem(key);
        }
        return res;
    };

    var storeValue = function(key, value) {
        if (window.localStorage !== undefined && key !== undefined && key !== null) {
            localStorage.setItem(key, value);
        }
    };

    var readUserType = function() {
        return readValue('epo.user.type');
    };

    // var trackUserType = function() {
    //     var userType = readUserType();
    //     console.log('user type is: ' + userType);
    //     if(typeof _paq == 'undefined'){
    //         return;
    //     }

    //     if(_paq) {
    //         _paq.push(["setCustomVariable", 1, "userType", userType, "visit"]);
    //         _paq.push(["trackPageView"]);
    //     }
    // };

    var storeUserType = function(userType) {
        storeValue('epo.user.type', userType);
    };

    var readCookieDecision = function() {
        return readValue('epo.cookie.decision');
    };

    var storeCookieDecision = function() {
        storeValue('epo.cookie.decision', 'accepted');
    };

    var hideMainPage = function() {

        $("#content-wrap").hide();

        if(readCookieDecision() === 'accepted') {
            $("#user-type-student").attr("tabIndex", 1);
            $("#user-type-teacher").attr("tabIndex", 2);
            $("[id^='cookies-bar']").attr("aria-hidden", true);
            $("#user-type-student").attr("aria-hidden", false);
            $("#user-type-teacher").attr("aria-hidden", false);

        } else {
            if (getLanguage() == 'pl') {
                $("#cookies-accept-pl").attr("tabIndex", 1);
                $("#cookies-accept-pl").attr("aria-hidden", false);
                $("#cookies-accept-en").attr("aria-hidden", true);
            }else {
                $("#cookies-accept-en").attr("tabIndex", 1);
                $("#cookies-accept-en").attr("aria-hidden", false);
                $("#cookies-accept-pl").attr("aria-hidden", true);
            }
            $("#user-type-student").attr("tabIndex", 2);
            $("#user-type-teacher").attr("tabIndex", 3);
            $("#user-type-student").attr("aria-hidden", false);
            $("#user-type-teacher").attr("aria-hidden", false);

        }
        $("#user-type-bar").show().attr("aria-hidden", false);
    };
    var showMainPage = function() {

        $("#content-wrap").show();

        if(readCookieDecision() === 'accepted') {
            $("#user-type-student").attr("tabIndex", -1);
            $("#user-type-teacher").attr("tabIndex", -1);
            $("[id^='cookies-bar']").attr("aria-hidden", true);
            $("#user-type-student").attr("aria-hidden", true);
            $("#user-type-teacher").attr("aria-hidden", true);


        } else {
            if (getLanguage() == 'pl') {
                $("#cookies-accept-pl").attr("tabIndex", null);
                $("#cookies-accept-pl").attr("aria-hidden", false);
                $("#cookies-accept-en").attr("aria-hidden", true);
            }else {
                $("#cookies-accept-en").attr("tabIndex", null);
                $("#cookies-accept-en").attr("aria-hidden", false);
                $("#cookies-accept-pl").attr("aria-hidden", true);
            }
            $("#user-type-student").attr("tabIndex", -1);
            $("#user-type-teacher").attr("tabIndex", -1);
            $("#user-type-student").attr("aria-hidden", true);
            $("#user-type-teacher").attr("aria-hidden", true);

        }
        $("#user-type-bar").hide().attr("aria-hidden", true);
    };

    var getLanguage = function() {
        var userLang = navigator.language || navigator.userLanguage;
        if (userLang.match(/pl/)) {
            return 'pl';
        }else{
            return 'en';
        }
    };

    $(document).ready(function() {
        // check whether cookie policy already accepted
        var cookieDecision = readCookieDecision();
        if(cookieDecision === 'accepted') {
            //cookies already accepted
            $("[id^='cookies-bar']").css('display', 'none');
        }else{
            //not accepted
            if (getLanguage() == 'pl') {
                $("#cookies-bar-pl").css('display', 'block');
            }else {
                $("#cookies-bar-en").css('display', 'block');
            }
            $("[id^='cookies-bar']").bind('click', function() {
                storeCookieDecision();
                $("[id^='cookies-bar']").css('display', 'none');
            });
        }
        // check whether user type already chosen
        var userType = readUserType();
        if (userType == null) {
            userType = 'student'
        }
        // Hide user/teacher info
        storeUserType(userType);
        // trackUserType();
        showMainPage();

    });

});
