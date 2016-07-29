var UPLOAD_URL = "//www.{{ TOP_DOMAIN }}/edit/store/api/push/module/" + getModuleId() + "/" + getModuleVersion() + "?lockid=";
var DOWNLOAD_URL = "//www.{{ TOP_DOMAIN }}/edit/store/api/pull/module/" + getModuleId() + "/" + getModuleVersion() + "?filename=module.xml&lockid=";

var LOCK_URL = "//www.{{ TOP_DOMAIN }}/edit/store/api/lock/module/" + getModuleId() + "/" + getModuleVersion();

var APP_NAME = "etx";
var LOCKAPP_URL = "//www.{{ TOP_DOMAIN }}/edit/store/api/app/lock/" + APP_NAME; //limited, etx
var IFRAME_URL = "//{{ EPO_ETX_IFRAME_ACTIVE_DOMAIN }}";


var collectionID = sessionStorage["parentCollectionId_"+getModuleId()+"_"+getModuleVersion()];

var lockId = null;
var lockTimeout = 0;
var applockId = null;
var applockTimeout = 0;
var loggedIn = true;


function getCollectionId() {return collectionID;}
//console.log("EPO: collection ID:",collectionID)   ;

function getUserRoles() {
    return $("#editor-common-metadata").attr("data-object-user-roles");
}

function setIDs(iframe) {
    iframe.postMessage("SETCOLLECTIONID"+collectionID, IFRAME_URL+'/');
    iframe.postMessage("SETMODULEID"+getModuleId()+"/"+getModuleVersion(), IFRAME_URL+'/');
    iframe.postMessage("SETUSERNAME"+getUserName(), IFRAME_URL+'/');
    iframe.postMessage("SETUSERROLES" + getUserRoles(), IFRAME_URL + '/');
}


//define reciver for callbacks from the iframe:
function messageBroker(event) {
    //console.log("EPO: messageBroker", event);
    if ( (event.origin == IFRAME_URL) || (event.origin == ("https:"+IFRAME_URL)) || (event.origin == ("http:"+IFRAME_URL)) ) {
        IFRAME_URL = event.origin;
        //console.log("Received message length:" +event.data.length);
        if (event.data.slice(0,"SAVE".length)=="SAVE") {
            saveModuleXML(event.source, event.data.slice("SAVE".length));
        } else {
            if (event.data.slice(0,"LOAD".length)=="LOAD") {
                setIDs(event.source);
                loadModuleXML(event.source);

            } else {
                //console.log("EPO: messageBroker. Command not supported!");
                BootstrapDialog.alert({
                        title: 'Problem z komunikacją',
                        message: 'Edytor przesłał nierozpoznane polecenie: '+event.data.slice(0,20)
                    });
            }
        }
        event.stopPropagation();

    } else {
        //console.log("EPO: Not this way!", event.origin,IFRAME_URL );
        BootstrapDialog.alert({
                        title: 'Problem z komunikacją z edytorem',
                        message: 'Nieprawidłowy nadawca: '+event.origin
                    });
    }
}

window.addEventListener('message', messageBroker, false);


function saveModuleXML(iframe, xmlDocument) {

    var moduleId = getModuleId();
    var version = getModuleVersion();
    //console.log("EPO: saveModuleXML", moduleId, version);
    lockModule("SAVE", iframe, xmlDocument, lockId);

}

function loadModuleXML(iframe) {

    var moduleId = getModuleId();
    var version = getModuleVersion();
    //console.log("EPO: loadModuleXML", moduleId, version);
    if (lockId == null) {
        lockId = sessionStorage["LOCK_ID"];
    }
    lockModule("LOAD", iframe, null, lockId);

}

function lockApplication(currentLockId) {
    if (getAppLockInBrowser() != null) {
        applockId = getAppLockInBrowser();

    }
    var moduleId = getModuleId();
    var version = getModuleVersion();
    var lockUrl = LOCKAPP_URL;
    var formData = new FormData();
    if (applockId) formData.append("lockid", applockId);
    formData.append("appid", APP_NAME); //limited, etx
    formData.append("mode", "use");

    //console.log("lockApplication", currentLockId, applockId);

    $(".modal.bootstrap-dialog.type-primary.fade.size-normal.in .btn.btn-default").click();
    $.ajax({
        type: "POST",
        url: lockUrl,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {


            if (data.status == 'ok') {
                applockId = data.lockid;
                applockTimeout = data.expiresin;
                if ((currentLockId == null) || (currentLockId != applockId)) {
                    addAppLockInBrowser(applockId);

                }
                if (lockId == null) {
                    lockModule("LOCK", null, null, lockId);
                } else {
                    var intLockTimeout = (applockTimeout - 30) * 1000;
                    if (intLockTimeout < 30000) intLockTimeout = 30000;
                    setTimeout(function () {
                        lockApplication(applockId);
                    }, intLockTimeout);
                }

            } else {

                var err = "Niestandardowa odpowiedź z serwera: " + data;
                var who = "";
                if (data.status == 'failure') {
                    err = getNiceLockError(data.reason);
                    who = getNiceLockWho(data.others);
                }
                BootstrapDialog.alert({
                    title: 'Problem przy zakładaniu blokady aplikacji na module ' + moduleId + ', wersja :' + version,
                    message: err + "</br>" + who
                });

                //closeEditor();

                var intLockTimeout = 30000;
                setTimeout(function () {
                    lockApplication(applockId);
                }, intLockTimeout);
                console.log(err, who);
            }
        },
        error: function (jqXHR, textStatus, errorMessage) {

            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy zakładaniu blokady aplikacji na module ' + moduleId + ', wersja :' + version,
                message: err
            });

            //closeEditor();

            var intLockTimeout = 30000;
            setTimeout(function () {
                lockApplication(applockId);
            }, intLockTimeout);
            console.log(err, textStatus, errorMessage);

        }
    });

}

function lockModule(operation, iframe, argument, currentLockId) {
    var moduleId = getModuleId();
    var version = getModuleVersion();
    //console.log("lockModule", operation, iframe, argument, currentLockId, moduleId);
    var lockUrl = LOCK_URL;

    var formData = new FormData();
    if (currentLockId) formData.append("lockid", currentLockId);
    formData.append("appid", APP_NAME);
    formData.append("mode", "write");
    //console.log("lockModule", lockUrl, document.domain);
    $(".modal.bootstrap-dialog.type-primary.fade.size-normal.in .btn.btn-default").click();
    $.ajax({
        type: "POST",
        url: lockUrl,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,

        success: function (data) {


            if (data.status == 'ok') {
                //console.log(data.lockid, data.expiresin);
                var firstTimeSuccess = (lockId == null);
                lockId = data.lockid;
                lockTimeout = data.expiresin;

                switch (operation) {
                    case "LOAD":
                        intLoadModuleXML(iframe);
                        iframe.postMessage("SETLOCKID" + lockId, IFRAME_URL + '/');
                        return;
                    case "SAVE":
                        intSaveModuleXML(iframe, argument);
                        return;
                    case "LOCK":
                        openEditor();
                        break;
                }

                var intLockTimeout = (lockTimeout - 30) * 1000;
                if (intLockTimeout < 30000) intLockTimeout = 30000;
                setTimeout(function () {
                    if (firstTimeSuccess) lockApplication(applockId);
                    lockModule('LOCK', iframe, null, lockId);
                }, intLockTimeout);

            } else {
                //lockId = null;
                var err = "Niestandardowa odpowiedź z serwera: " + data;
                var who = "";
                if (data.status == 'failure') {
                    err = getNiceLockError(data.reason);
                    who = getNiceLockWho(data.others);
                }

                BootstrapDialog.alert({
                    title: 'Problem przy zakładaniu blokady na module ' + moduleId + ', wersja :' + version,
                    message: err + "</br>" + who
                });
                if (lockId == null) {  //module not loaded by ETX - release ETX lock
                    unlockApplication();
                }
                var intLockTimeout = 30000;
                if (operation == "SAVE") iframe.postMessage("SAVEDfalse", IFRAME_URL + '/');
                setTimeout(function () {
                    if (lockId) {
                        lockModule(operation, iframe, argument, lockId);
                    } else {
                        lockApplication(null);
                    }

                }, intLockTimeout);
                console.log(err, who);

            }
        },
        error: function (jqXHR, textStatus, errorMessage) {
            //lockId = null;
            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy zakładaniu blokady na module ' + moduleId + ', wersja :' + version,
                message: err
            });
            if (lockId == null) {  //module not loaded by ETX - release ETX lock
                unlockApplication();
            }
            var intLockTimeout = 30000;
            if (operation == "SAVE") iframe.postMessage("SAVEDfalse", IFRAME_URL + '/');
            setTimeout(function () {
                if (lockId) {
                    lockModule(operation, iframe, argument, lockId);
                } else {
                    lockApplication(null);
                }
            }, intLockTimeout);
            console.log(err, textStatus, errorMessage);


        }
    });

}

function getNiceLockError(reason) {
    if (reason) {
        switch (reason) {
            case 'other-write':
                return "Inny użytkownik otworzył ten plik do zapisu. Proszę spróbować później.";
            case 'other-read':
                return "Inny użytkownik otworzył ten plik do odczytu. Proszę spróbować później.";
            case 'app-limit':
                return "Wyczerpano limit uruchomionych aplikacji. Proszę spróbować później.";
            case 'denied':
                return "Operacja odrzucona. Proszę spróbować później.";
            case 'internal':
                return "Wewnętrzny problem serwera. Proszę spróbować później.";
            case 'unknown':
                return "Nieznany problem. Proszę spróbować później. Administrator został powiadomiony.";
        }
    }
    return "Nieprzewidziany problem. Proszę sprawdzić dostęp do Internetu i spróbować później.";

}
function getNiceLockWho(others) {
    var output = "";
    if ((others) && (others.length > 0)) {

        if (others.length > 1) output = "Użytkownicy";
        if (others.length == 1) output = "Użytkownik";
        output += " blokujący zasób: ";
        for (var i = 0; i < others.length; i++) {
            output += others[i].user;
            if (i == (others.length - 1)) break;
            output += ", ";
        }
    } else {
        output = "Brak danych o użytkownikach blokujących zasób.";
    }

    return output;

}

function getNiceRole(role) {
    switch (role) {
        case 'author':
            return "autor";
        case 'editor':
            return "redaktor";
        case 'publisher':
            return "wydawca";
        case 'reviewer':
            return "recenzent";
    }
    return role;
}

function intLoadModuleXML(iframe) {
    //console.log("EPO: loadModuleXML");
    var moduleId = getModuleId();
    var version = getModuleVersion();

    //console.log("intLoadModuleXML", moduleId, version);
    if (lockId == null) {

        BootstrapDialog.alert({
            title: 'Problem przy ładowaniu modułu ' + moduleId + ', wersja :' + version,
            message: "Próba założenia blokady na pliku nie powiodła się."
        });
        return;

    }

    var moduleUrl = DOWNLOAD_URL + lockId;
    $.ajax({
        type: "get",
        url: moduleUrl,
        dataType: "text",
        cache: false,
        success: function (data) {

            //console.log(data);
            iframe.postMessage("LOAD" + data, IFRAME_URL + '/');
        },
        error: function (jqXHR, textStatus, errorMessage) {
            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy ładowaniu modułu ' + moduleId + ', wersja :' + version,
                message: err
            });
            console.log(err, textStatus, errorMessage);

        }
    });
}

function intSaveModuleXML(iframe, xmlDocument) {
    //console.log("EPO: saveModuleXML",xmlDocument);

    var moduleId = getModuleId();
    var version = getModuleVersion();
    //console.log("intSaveModuleXML", moduleId, version);
    if (lockId == null) {

        BootstrapDialog.alert({
            title: 'Problem przy zapisywaniu modułu ' + moduleId + ', wersja :' + version,
            message: "Próba potwierdzenia blokady na pliku, przed zapisem, nie powiodła się."
        });

        iframe.postMessage("SAVEDfalse", IFRAME_URL + '/');

    }

    var uploadUrl = UPLOAD_URL + lockId;
    //console.log(uploadUrl);
    var formData = new FormData();
    var blob = new Blob([xmlDocument], { type: "text/xml"});
    formData.append("xml_file", blob);
    $.ajax({
        url: uploadUrl,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'text',
        processData: false,
        contentType: false,
        error: function (jqXHR, textStatus, errorMessage) {
            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy zapisywaniu modułu ' + moduleId + ', wersja :' + version,
                message: err
            });
            iframe.postMessage("SAVEDfalse", IFRAME_URL + '/');
            console.log(err, textStatus, errorMessage);
        },
        success: function (jqXHR, textStatus, message) {
            iframe.postMessage("SAVEDtrue", IFRAME_URL + '/');
        }
    });
}

function unlockModule() {
    //console.log("unlockModule", lockId, getModuleId());

    if (lockId == null) return;
    var moduleId = getModuleId();
    var version = getModuleVersion();
    var lockUrl = LOCK_URL;
    var formData = new FormData();
    formData.append("lockid", lockId);
    formData.append("appid", APP_NAME); //limited, etx
    formData.append("mode", "drop");

    $.ajax({
        type: "POST",
        url: lockUrl,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        async: false,
        success: function (data) {


            if (data.status == 'ok') {
                //console.log("unlockModule", data.lockid, data.expiresin);
                lockId = null;
                lockTimeout = 0;


            } else {
                lockId = null;
                var err = "Niestandardowa odpowiedź z serwera: " + data;
                if (data.status == 'failure') {
                    err = getNiceLockError(data.reason);
                }
                BootstrapDialog.alert({
                    title: 'Problem przy zdejmowaniu blokady z modułu ' + moduleId + ', wersja :' + version,
                    message: err
                });
                console.log(err);
            }
        },
        error: function (jqXHR, textStatus, errorMessage) {
            lockId = null;
            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy zdejmowaniu blokady z modułu ' + moduleId + ', wersja :' + version,
                message: err
            });
            console.log(err, textStatus, errorMessage);
        }
    });

}


function unlockApplication() {
    if (applockId == null) {
        console.log("ERROR: unlockApplication applockId is null.");
        applockId = getAppLockInBrowser();
        if (applockId == null) {
            console.log("FATAL: unlockApplication 'APPLOCK_ID' value is null!");
            return;
        }
    }
    var appNumber = dropAppLockInBrowser();
    if (appNumber > 0) {
        //console.log("Still active tabs number: " + appNumber);
        return;
    } //another tab is using lock for this app
    //console.log("Closing last tab...");

    var moduleId = getModuleId();
    var version = getModuleVersion();
    var lockUrl = LOCKAPP_URL;
    var formData = new FormData();
    formData.append("lockid", applockId);
    formData.append("appid", APP_NAME); //limited, etx
    formData.append("mode", "drop");

    $.ajax({
        type: "POST",
        url: lockUrl,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        async: false,
        success: function (data) {


            if (data.status == 'ok') {
                applockId = null;
                applockTimeout = 0;


            } else {
                applockId = null;
                var err = "Niestandardowa odpowiedź z serwera: " + data;
                if (data.status == 'failure') {
                    err = getNiceLockError(data.reason);
                }
                BootstrapDialog.alert({
                    title: 'Problem przy zdejmowaniu blokady z aplikacji dla modułu ' + moduleId + ', wersja :' + version,
                    message: err
                });
                console.log(err);
            }

        },
        error: function (jqXHR, textStatus, errorMessage) {
            applockId = null;
            var err = getNiceLockError(textStatus);
            BootstrapDialog.alert({
                title: 'Problem przy zdejmowaniu blokady z aplikacji dla modułu ' + moduleId + ', wersja :' + version,
                message: err
            });
            console.log(err, textStatus, errorMessage);
        }
    });

}

function addAppLockInBrowser(applockid) {
    if ($.cookie("APPLOCK") == null) {
        $.cookie("APPLOCK", "EXISTS", { path: '/' });
        localStorage["APPLOCK_NUMBER"] = "0";
    }
    if (localStorage["APPLOCK_NUMBER"] == null) localStorage["APPLOCK_NUMBER"] = "0";
    localStorage["APPLOCK_NUMBER"] = (Number(localStorage["APPLOCK_NUMBER"]) + 1);
    localStorage["APPLOCK_ID"] = applockid;
}

function dropAppLockInBrowser() {
    //console.log("Applock number",localStorage["APPLOCK_NUMBER"]);
    if ($.cookie("APPLOCK") == null) {
        localStorage.removeItem("APPLOCK_ID");
        localStorage.removeItem("APPLOCK_NUMBER");
        return 0;
    }

    if (localStorage["APPLOCK_NUMBER"] == null) {
        localStorage.removeItem("APPLOCK_ID");
        return 0;
    }

    if (Number(localStorage["APPLOCK_NUMBER"]) > 0) {
        localStorage["APPLOCK_NUMBER"] = (Number(localStorage["APPLOCK_NUMBER"]) - 1);
    }
    if (Number(localStorage["APPLOCK_NUMBER"]) == 0) {
        localStorage.removeItem("APPLOCK_ID");
        localStorage.removeItem("APPLOCK_NUMBER");
        return 0;
    }

    return Number(localStorage["APPLOCK_NUMBER"]);
}

function getAppLockInBrowser() {
    if ($.cookie("APPLOCK") == null) {
        $.cookie("APPLOCK", "EXISTS", { path: '/' });
        localStorage["APPLOCK_NUMBER"] = "0";
    }
    return (localStorage["APPLOCK_ID"] == "" ? null : localStorage["APPLOCK_ID"]);
}

function openEditor() {
    if ($("#xopus iframe").length == 0) {
        $("#xopus").append('<iframe src="' + IFRAME_URL + '/portal/other/etx/epeditor/start.html" style="width: 100%; height: 100%; border: 0px" ></iframe>');
    }

}
function closeEditor() {
    $("#xopus").empty();
}


window.onload = function (e) {

    $(window).bind('unload', function () {
        if (loggedIn) {
            console.log("Module closing, releasing locks... ");
            unlockModule();
            unlockApplication();
        } else {
            console.log("Module already closed, leaving... ");
        }
        console.log("Thank you for edition session.");
    });

    $('#epoLogout').on('click', function () {
        console.log("Logout, module closing, releasing locks... ");
        unlockModule();
        unlockApplication();
        loggedIn = false;
    });

    lockApplication(null);

};

