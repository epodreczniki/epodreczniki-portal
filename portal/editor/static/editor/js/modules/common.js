require(['jquery',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json'], function () {
    'use strict';
});

var beforeunloadEvent = function (e) {
        var confirmationMessage = "Masz niezapisane zmiany. Chcesz je utracić?";

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
function addLeaveWarning() {
    window.addEventListener("beforeunload", beforeunloadEvent, false);

};
function removeLeaveWarning() {
    window.removeEventListener("beforeunload", beforeunloadEvent, false);

};