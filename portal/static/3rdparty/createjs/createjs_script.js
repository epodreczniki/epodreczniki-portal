var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
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

function getScript(src, onload) {
	var script = document.createElement('script');
	script.onload = onload;
	script.src = src;
	document.getElementsByTagName('head')[0].appendChild(script);
}

if (navigator.userAgent.indexOf("MSIE") == -1 && document.domain != '') {
    try{
	    document.domain = stripHost(document.domain);
    }catch(err){
        console.log(err);
    }
}

function initResize(){
	var cnvs = document.getElementById('canvas');
	var originalHeight = cnvs.getAttribute('height');
	var originalWidth = cnvs.getAttribute('width');
	function resizeFunc(){			
		var height = originalHeight;
		var width = originalWidth;
		aspect = width / height;

		if(window.innerHeight < window.innerWidth) {
			var resizedHeight = window.innerHeight;
			var resizedWidth = resizedHeight * aspect;
		}

		else {
			var resizedWidth = window.innerWidth;
			var resizedHeight = resizedWidth / aspect;      
		}
		cnvs.style.height = resizedHeight + 'px';
		cnvs.style.width = resizedWidth + 'px';
	}
	addEvent(window, 'resize', resizeFunc);
	resizeFunc();
}

//document.body.onload = null;

addEvent(window, 'load', function(){
		document.body.style.margin = '0';
		document.body.style.overflow = 'hidden';
		initResize();
});



