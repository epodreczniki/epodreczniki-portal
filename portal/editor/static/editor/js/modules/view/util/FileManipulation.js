define(['declare', 'jquery'], function (declare, $) {
    return declare({
        'static': {
            download: function (holder, filename, text, ext) {
                if (typeof ext == 'undefined') {
                    ext = 'json';
                }
                var pom = $('<a>');
                holder.append(pom);
                var blob = new Blob([text], { type: 'text/' + ext });
                var url = URL.createObjectURL(blob);
               // pom.attr('href', 'data:application/' + ext + ';charset=utf-8,' + encodeURIComponent(text));
                pom.attr('href', url);
                pom.attr('download', filename);
                pom[0].click();
                pom.remove();
            }
        }
    });
});
