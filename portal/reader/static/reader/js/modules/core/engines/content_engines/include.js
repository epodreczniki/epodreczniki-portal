define(['./MathJaxEngine',
    './TestEngine',
    './DifficultyLevelEngine',
    './PostLoadEngine'
], function (MathJaxEngine, TestEngine, DifficultyLevelEngine, PostLoadEngine) {

    var engines = [];
    return {
        registerOnLoadEngines: function(){
//            engines.push(new TestEngine());
//            engines.push(new DifficultyLevelEngine());
            engines.push(new PostLoadEngine());
        },

        fireOnLoadEngines: function(placeholder, options){
            engines.forEach(function(obj){
                obj.reload(placeholder, options);
            });
        },

        runOn: function(placeholder, options){
            engines.forEach(function(obj){
                obj.runOn(placeholder, options);
            });
        }
    }
});