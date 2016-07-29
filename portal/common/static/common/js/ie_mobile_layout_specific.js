/**
 * Created by Gosia on 23.06.14.
 */
define(['jquery'], function ($) {

    var isIEMobile= !!navigator.userAgent.match(/IEMobile/);
    if(isIEMobile === true){
        $("#viewport").attr("content", "width=device-width;  initial-scale=1");
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
        document.getElementsByTagName("head")[0].appendChild(msViewportStyle);

        $('@-ms-viewport').css('width', 'device-width');

        }
});
