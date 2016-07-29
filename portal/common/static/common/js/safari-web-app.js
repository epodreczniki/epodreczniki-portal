/* Based on https://gist.github.com/irae/1042167 */

(function (document, navigator, standalone) {
    /* prevents links from apps from oppening in mobile safari */
    /* this javascript must be the first script in your <head> */
    if ((standalone in navigator) && navigator[standalone]) {
        var curnode, location = document.location, stop = /^(a|html)$/i;
        document.addEventListener('click', function (e) {
            curnode = e.target;
            while (!(stop).test(curnode.nodeName)) {
                curnode = curnode.parentNode;
            }
            if (
                curnode.href && /* is a link */
                    (chref = curnode.href).replace(location.href, '').indexOf('#') && /* is not an anchor */
                    (!(/^[a-z\+\.\-]+:/i).test(chref) ||                              /* either does not have a proper scheme (relative links) */
                        href.indexOf(location.protocol + '//' + location.host) === 0) /* or is in the same protocol and domain */
                ) {
                e.preventDefault();
                location.href = curnode.href;
            }
        }, false);
    }
})(document, window.navigator, 'standalone');