requirejs.config({
    paths: {
        aceEditor: '{{ STATIC_URL }}3rdparty/aceeditor/src-noconflict/ace'
    },

    shim: {
        aceEditor: {
            exports: 'ace'
        }
    }
});

define([
    'jquery',
    'editor_driver/EditorDriver',
    'bar_editor_driver/BarEditorDriver'], function ($, EditorDriver, BarEditorDriver) {

    return {

        run: function () {
            require(['aceEditor'], function (ace) {
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/chrome");

                var ext_mappings = {
                    'js': "ace/mode/javascript",
                    'json': "ace/mode/json",
                    'xml': "ace/mode/xml",
                    'html': "ace/mode/html",
                    'htm': "ace/mode/html"
                };

                var editorNode = $('#editor');

                var barEditorDriver = new BarEditorDriver({
                    metadata: EditorDriver.toJSON(),
                    xmlEditor: true,
                    filesPushProvider: function () {
                        return {
                            content: editor.getValue(),
                            filepath: editorNode.data('path')
                        }
                    },
                    beforePushValidator: function () {
                        return editor.getSession().getAnnotations().reduce(function (result, item) {
                            item.type == "error" && result.push(item);
                            return result;
                        }, []);
                    },
                    setReadOnlyStateHandler: function (readonly) {
                        editor.setReadOnly(readonly);
//                        this.markChangeOccurred();
                    }
                });

                editor.getSession().setMode(ext_mappings[editorNode.data('path').split('.')[1]]);

                editor.getSession().setUseWrapMode(true);

                editorNode.on('keyup', function(e){
                     if(_.indexOf([16, 17, 18, 19, 20, 37, 38, 39, 40], e.keyCode) != -1 ){
                         return;
                     }

                     barEditorDriver.markChangeOccurred();
                     barEditorDriver.lockDriver.write();
                });
            });
        }
    }
});
