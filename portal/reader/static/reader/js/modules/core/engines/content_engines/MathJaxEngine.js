define(['jquery', 'underscore', './ContentEngineInterface'], function ($, _, ContentEngineInterface) {

    return ContentEngineInterface.extend({

        initialize: function () {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);

            MathJax.Hub.Register.StartupHook("End", function () {
                _.each($('div.table').find('table'), function(table){
                    MathJax.Hub.Queue(["Rerender", MathJax.Hub, table]);
                });
            });

            MathJax.Hub.Startup.signal.Interest(
                function (message) {
                    //console.log("Startup: "+message);
                }
            );
            MathJax.Hub.signal.Interest(function (message) {
                    if(message == "End Process,[object HTMLBodyElement]"){
                        _.each($('div.table').find('table'), function(table){
                            MathJax.Hub.Queue(["Rerender", MathJax.Hub, table]);
                        });
                    }
                }
            );

        },

        reload: function (placeholder, options) {
            //MathJax.Hub.Queue(['Rerender', MathJax.Hub]);
            if (typeof MathJax !== 'undefined') {
                function cb(){
                    if(options && options.callback && _.isFunction(options.callback)){
                        options.callback(placeholder, options);
                    }
                }
                if (options && options.typeset) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(placeholder)[0], cb]);
                } else {
                    MathJax.Hub.Queue(["Rerender", MathJax.Hub, $(placeholder)[0], cb]);//MathJax.Hub.Rerender($(placeholder)[0]);
                }
            }
        }

    });



});
