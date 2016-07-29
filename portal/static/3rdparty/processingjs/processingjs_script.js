function stripHost(domain) {
    var pos = domain.indexOf('.');
    if (pos == -1) {
        return domain;
    } else {
        return domain.substr(pos + 1);
    }
}

if (navigator.userAgent.indexOf("MSIE") == -1 && document.domain != '') {
    try {
        document.domain = stripHost(document.domain);
    } catch (err) {
        console.log(err);
    }
}

var addEvent = function (elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    }
    else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    }
    else {
        elem["on" + type] = eventHandle;
    }
};
addEvent(window, 'load', function () {
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    var cnvs = document.getElementsByTagName("canvas");
    if (cnvs && cnvs.length == 1) {
        parent.postMessage({ msg: 'edgeResize', width: cnvs[0].width, height: cnvs[0].height }, "*");
    }
    else {
        document.body.innerHTML = "Nieprawidłowa struktura pliku index.html. Powinien on zawierać dokładnie jeden canvas.";
    }
});