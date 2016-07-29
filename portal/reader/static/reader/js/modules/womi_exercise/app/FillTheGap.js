define(['_jquery',
        'underscore',
        'backbone',
        '../views/FillTheGap',
        '../views/FillTheSelect',
        '../views/FillTheGapTableView'],

        function($, _, backbone, FillTheGapView, FillTheSelectView, FillTheGapTableView) {

            var create = function(config, body, answers, bus, readerApi) {

                var body = body;
                var random;

                if (config.randomize) {
                    random = true;
                };

                var view = {
                    "UT-1": FillTheGapView,
                    "UT-2": FillTheSelectView,
                    "UT-3": FillTheGapTableView
                };

                var Body = Backbone.Model.extend({
                    defaults: {
                        inputSize: ''
                    }
                });
                var Answer = Backbone.Model.extend({});

                var BodyCollection = Backbone.Collection.extend({
                    model: Body
                });

                var AnswersCollection = Backbone.Collection.extend({
                    model: Answer
                });

                var exerciseBody = new BodyCollection(body);

                var exerciseAnswers = new AnswersCollection(answers);

                var exerciseView = new view[config.type]({body: exerciseBody, answers: exerciseAnswers, eventBus: bus, strictMode: config.strictMode, random: config.randomize,
                                            answerType: config.answerType, readerApi: readerApi, differentAnswers: config.differentAnswers});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);
