define(['underscore',
        'backbone',
        '../utils/imgParser',
        '../views/TableQuiz'], 

        function(_, backbone, imgParser, TableQuizView) {
            
            var create = function(config, answers, questions, bus, readerApi) {

                var Answers = backbone.Collection.extend({}),
                    Questions = backbone.Collection.extend({});

                var answers = new Answers(answers),
                    questions = new Questions(questions),
                    exerciseView = new TableQuizView({
                        answers: answers, 
                        questions: questions, 
                        eventBus: bus,
                        readerApi: readerApi
                    });

                return {
                    view: exerciseView
                }

            };
            
            return {
                create: create
            }
            
        }
);
