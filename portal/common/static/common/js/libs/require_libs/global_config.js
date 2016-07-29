requirejs.config({
    optimize: 'none',
    onBuildRead: function (moduleName, path, contents) {
        var pattern1 = /\{\%.*\%\}/g;
        var pattern2 = /\{\{.*\}\}/g;

        //Always return a value.]
        function toBase64(g1){
            return 'django_code:' + (new Buffer(g1).toString('base64'));
        }
        var content = contents.replace(pattern1, toBase64);
        content = content.replace(pattern2, toBase64);
        content = this._processComment(content, function(line){
            return '// ' + line + '\n';
        });
        return content;
    },
    _processComment: function(content, lineCallback){
        var patternUseComment = /(\/\/\>startComment[\n\s])([\s\S]*?)(?=\/\/\>endComment)/gm;
        function commentText(g1, g2, g3){
            var comment = g2 + '\n';
            g3.split(/\n/).forEach(function(line){
                comment += lineCallback(line);
            });
            return comment;
        }
        return content.replace(patternUseComment, commentText);
    },

    //A function that will be called for every write to an optimized bundle
    //of modules. This allows transforms of the content before serialization.
    onBuildWrite: function (moduleName, path, contents) {
        //Always return a value.
        var decodePattern = /django_code:((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)/g;
        var content = contents.replace(decodePattern, function(g1, g2){
            return (new Buffer(g2, 'base64').toString('utf8'));
        });
        content = this._processComment(content, function(line){
            return line.replace(/\/\//, '') + '\n';
        });

        return content;
    },
    fileExclusionRegExp: null
});
