function stripHost(domain) {
	var pos = domain.indexOf('.');
	if (pos == -1) {
		return domain;
	} else {
		return domain.substr(pos + 1);
	}
}

if (navigator.userAgent.indexOf("MSIE") == -1 && document.domain != '') {
    try{
	    document.domain = stripHost(document.domain);
    }catch(err){
        console.log(err);
    }
}