define(['./GeneratedExerciseEngine'], function(GeneratedExerciseEngine){
    return GeneratedExerciseEngine.extend({
        additionalOpts: function(require, obj, ReaderApi){
            var readerApiObj = new ReaderApi(require, null, this.source);
            return {
                source: this.source,
                readerApiObject: readerApiObj
            }
        },
        getSource: function(){
            return '/global/libraries/cp/v1_0/womi.js';
        }
    })
});
