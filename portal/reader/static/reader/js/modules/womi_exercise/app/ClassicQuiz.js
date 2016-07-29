define(['underscore',
        'backbone',
        '../utils/imgParser',
        '../collections/Answers',
        '../views/SingleAnswersExercise',
        '../views/MultipleAnswersExercise',
        '../views/TrueFalseExercise'], 

        function(_, Backbone, imgParser, AnswersCollection, SingleAnswerExerciseView, MultipleAnswersExercise, TrueFalseExercise) {
            
            var create = function(config, answers, bus, source, readerApi) {
                
                var view = {
                    "ZJ-1": SingleAnswerExerciseView,
                    "ZW-1": MultipleAnswersExercise,
                    "ZW-2": TrueFalseExercise
                };
                
                var answerCollection = new AnswersCollection([], config);
                
                var multiSets;

                if (answers.length > config.numberOfPresentedAnswers) {
                    multiSets = true;
                };

                _.each(answers, function(answer) {
                    answer.content = imgParser.addImages(answer.content, answer.images, source);
                    answerCollection.add(answer).set({name: config.id+"_"+readerApi.womiId});
                });
                
                var exerciseView = new view[config.type](
                    {
                        collection: answerCollection,
                        eventBus: bus,
                        readerApi: readerApi
                    }
                );
                
                return {
                    view: exerciseView,
                    multiSets: multiSets
                }
                
            };
            
            return {
                create: create
            }
            
        }
);
