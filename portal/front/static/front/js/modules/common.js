
require(['jquery', 'jqueryui', 'declare', 'underscore', 'backbone', 'domReady', 'bowser'], function () {
    'use strict';
    // detecting high contrast mode
    jQuery(function () {
        console.log("Checking for high-contrast mode...");
        var objDiv, strColor;
        objDiv = document.createElement('div');
        objDiv.style.color = 'rgb(31, 41, 59)';
        document.body.appendChild(objDiv);
        strColor = document.defaultView ? document.defaultView.getComputedStyle(objDiv, null).color : objDiv.currentStyle.color;
        strColor = strColor.replace(/ /g, '');
        document.body.removeChild(objDiv);
        if (strColor !== 'rgb(31,41,59)') {
            $('body').addClass('high-contrast');
            console.log("High-contrast mode detected.");
        } else {
            console.log("Standard-contrast mode detected.");
        }
    });

});
