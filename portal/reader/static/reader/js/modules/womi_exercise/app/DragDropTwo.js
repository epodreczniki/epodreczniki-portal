define(['_jquery',
        'underscore',
        'backbone',
        '../views/DragDropFill'],

        function($, _, backbone, DragDropFillView) {
        
            var create = function(config, body, answers, bus, readerApi) {

                var answers = answers;

                if (config.randomize) {
                    answers = _.shuffle(answers);
                }
            
                var Body = backbone.Model.extend({});
                var Answer = backbone.Model.extend({});

                var BodyCollection = backbone.Collection.extend({
                    model: Body
                });
                
                var AnswersCollection = backbone.Collection.extend({
                    model: Answer 
                });

                var exerciseBody = new BodyCollection(body);

                var exerciseAnswers = new AnswersCollection(answers);

                var exerciseView = new DragDropFillView({body: exerciseBody, answers: exerciseAnswers, eventBus: bus, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);
