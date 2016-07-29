var addEvent = function (elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    } else {
        elem["on" + type] = eventHandle;
    }
};

function stripHost(domain) {
    var pos = domain.indexOf('.');
    if (pos == -1) {
        return domain;
    } else {
        return domain.substr(pos + 1);
    }
}

//var messageDomain = stripHost(document.domain)

if (navigator.userAgent.indexOf("MSIE__") == -1 && document.domain != '') {
    try {
        document.domain = stripHost(document.domain);
    } catch (err) {
        console.log(err);
    }
}

addEvent(window, 'load', function () {

    AdobeEdge.bootstrapCallback(function (compId) {
        AdobeEdge.Symbol.bindElementAction(compId, 'stage', 'document', 'compositionReady', function (sym, e) {

            var cnvs = document.getElementById('Stage');
            var wrap = document.getElementById('StageWrap');
            var originalHeight = cnvs.style.height;
            var originalWidth = cnvs.style.width;

            if (originalHeight && originalWidth) {
                originalHeight = originalHeight.replace('px', '');
                originalWidth = originalWidth.replace('px', '');
                console.log(originalHeight, originalWidth);
                var newScale = 1;

                function resizeFunc() {
                    var height = originalHeight;
                    var width = originalWidth;
                    var aspect = width / height;

                    if (window.innerHeight < window.innerWidth) {
                        var resizedHeight = window.innerHeight;
                        var resizedWidth = resizedHeight * aspect;
                    }
                    else {
                        var resizedWidth = window.innerWidth;
                        var resizedHeight = resizedWidth / aspect;
                    }
                    newScale = originalWidth / resizedWidth;
                    cnvs = wrap;
                    //cnvs.style.height = resizedHeight + 'px';
                    //cnvs.style.width = resizedWidth + 'px';
                    var scale = "translateZ(0) scale(" + 1 / newScale + ")";
                    var transformOrigin = '0 0';
                    cnvs.style.webkitTransformOrigin = transformOrigin;
                    cnvs.style.MozTransformOrigin = transformOrigin;
                    cnvs.style.msTransformOrigin = transformOrigin;
                    cnvs.style.OTransformOrigin = transformOrigin;
                    cnvs.style.transformOrigin = transformOrigin;
                    cnvs.style.position = 'absolute';
                    cnvs.style.webkitTransform = scale;
                    cnvs.style.MozTransform = scale;
                    cnvs.style.msTransform = scale;
                    cnvs.style.OTransform = scale;
                    cnvs.style.transform = scale;


                }

                //addEvent(window, 'resize', resizeFunc);
                //resizeFunc();
                document.body.style.margin = '0';
                document.body.style.overflow = 'hidden';
                window.parent.postMessage({ msg: 'edgeResize', width: originalWidth, height: originalHeight }, '*');
                //window.frameElement.callResize(originalWidth, originalHeight);
            }
        });

    });

});