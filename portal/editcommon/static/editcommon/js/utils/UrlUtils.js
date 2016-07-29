define(['declare', 'jquery'], function (declare, $) {
    return declare({
        'static': {
            resolveUrl: function (url, params) {
                var newUrl = url;
                for (var param in params) {
                    newUrl = newUrl.replace('{' + param + '}', params[param]);
                }
                return newUrl;
            }
        }
    });
});