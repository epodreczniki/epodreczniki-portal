define(['declare',
        '_jquery',
        'backbone',
        '../../core/Registry',
        '../utils/imgParser',
        '../models/Description',
        '../views/Description',
        '../views/Controls',
        '../app/ClassicQuiz',
        '../app/FillTheGap',
        '../app/DragDropOne',
        '../app/DragDropTwo',
        '../app/DragDropSort',
        '../app/DragDropMatch',
        '../app/Crossword',
        '../app/TableQuiz',
        '../app/Memory'],

        function (declare, $, Backbone, Registry, imgParser, DescriptionModel, DescriptionView, ControlsView, ClassicQuiz, FillTheGap, DragDropOne, DragDropTwo, DragDropSort, DragDropMatch, Crossword, TableQuiz, Memory) {

            'use strict';

            function createExercise(data, destination, source, readerApi) {

                var config = data.config,
                    type = config.type,
                    desc = data.description,

                    viewOpts = {
                        correctFeedback: desc.correctFeedback,
                        wrongFeedback: desc.wrongFeedback,
                        globalHint: desc.hint
                    };

                desc.content = imgParser.addImages(desc.content, desc.images, source);
                desc.content = imgParser.addWomi(desc.content, desc.womis, source);

                var descriptionModel = new DescriptionModel(
                    {
                        title: desc.title,
                        author: desc.author,
                        content: desc.content
                    }
                );

                var eventBus = _.extend({}, Backbone.Events);

                var descriptionView = new DescriptionView({ model: descriptionModel });

                var container = $('<div/>', {
                    'class': 'womi-exercise-container'
                });

                $(destination).append(container);
                container.append(descriptionView.render().el);

                var exercise;

                switch (type) {
                    case "ZJ-1":
                    case "ZW-1":
                    case "ZW-2":
                        exercise = ClassicQuiz.create(config, data.answers, eventBus, source, readerApi);
                        break;
                    case "UT-1":
                    case "UT-2":
                    case "UT-3":
                        exercise = FillTheGap.create(config, data.body, data.answers, eventBus, readerApi);
                        break;
                    case "DGL-1":
                    case "DGT-1":
                        exercise = DragDropOne.create(config, data.droppable, data.draggable, eventBus, source, readerApi);
                        break;
                    case "DGU-1":
                        exercise = DragDropTwo.create(config, data.body, data.answers, eventBus, readerApi);
                        break;
                    case "DGS-2":
                    case "DGS-1":
                        exercise = DragDropSort.create(config, data.sortable, data.correctOrder, eventBus, source, readerApi);
                        break;
                    case "DGD-1":
                        exercise = DragDropMatch.create(config, data.body, data.answers, eventBus, source, readerApi);
                        break;
                    case "CW-1":
                        exercise = Crossword.create(config, data.body, eventBus, readerApi);
                        break;
                    case "TMW-1":
                        exercise = TableQuiz.create(config, data.answers, data.questions, eventBus, readerApi);
                        break;
                    case "MEM-1":
                        exercise = Memory.create(config, data.body, eventBus, source, readerApi);
                        break;
                }

                var exerciseContent = $('<div/>', {
                    'class': 'exercise-content'
                });

                container.append(exerciseContent);

                exerciseContent.append(exercise.view.render().el);

                viewOpts.multiSets = exercise.multiSets;

                var controlsView = new ControlsView({eventBus: eventBus, viewOpts: viewOpts, readerApi: readerApi});

                container.append(controlsView.render().el);

                // Check if exercise has any MathML nodes, if so rerender.
                if (Registry.get('layout')) {
                    if (exerciseContent.has("math, .MathJax").length) {
                        var womiContainer = destination.closest('.womi-container');
                        Registry.get('layout').trigger('refreshContent', womiContainer, {typeset: true});
                    }
                }

                return exercise;

            }

            return {
                createExercise: createExercise,
                exercise: createExercise.exercise
            }

        }
);
