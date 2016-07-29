define(['jquery','underscore','modules/core/WomiManager'], function ($, _, womi) {
    'use strict';

    function RandomExercise(exercise) {
        this.exercise = $(exercise);
        this.item = this.exercise.find('.qmlitem');

        this.type = this.item.data('type');
        this.answers = this.item.find('> form .answer');
        this.presentationStyle = this.item.data('presentationStyle');

        this._hasWomi = false;
        if (this.answers.find('.womi-container').length
            && (this.answers.find('.womi-container').length > 0)) {
            this._hasWomi = true;
        }
    }

    RandomExercise.prototype.clear = function (includeChecked) {
        this.clearFeedback();
        this.clearHint();
        this.clearMarks();
        if (includeChecked) {
            this.clearChecked();
        }
    };

    RandomExercise.prototype.disable = function () {
        this.item.find('button.check').attr('disabled', 'disabled');
        this.item.find('button.recreate').attr('disabled', 'disabled');
        this.answers.find('input').attr('disabled', 'disabled');
    };

    RandomExercise.prototype.clearHint = function () {
        this.item.find('button.hint > .next-hint-label').hide();
        this.item.find('button.hint > .hint-label').show();
        this.item.find('button.hint').hide();
        this.item.find('> .answer-hint.hint').removeClass('hint');
        this.item.find('> .hint').hide();
        this.item.find('> .answer-hint').hide();
    };

    RandomExercise.prototype.handleAnswerHints = function () {
        var answerHints = [];
        _.each(this.answers, function (answer) {
            answer = $(answer);
            var hint = answer.find('> .hint');
            if (hint.length) {
                hint.data('answerId', answer.find('> input').prop('id'));
                hint.addClass('answer-hint');
                hint.removeClass('hint');
                answerHints.push(hint[0]);
            }
        });
        $(answerHints).insertBefore(this.item.find('> .hint:first'));
    };

    RandomExercise.prototype.hintsVisible = function () {
        return this.item.find('> .hint:visible').length > 0;
    };

    RandomExercise.prototype.showHint = function (checkedId) {
        if (this.hintsVisible()) {
            return;
        }

        // handle hints related with checked answer
        if (checkedId) {
            this.item.find('> .answer-hint').each(function(i,a) {
                var answerHint = $(a);
                if (answerHint.data('answerId') == checkedId) {
                    answerHint.addClass('hint');
                }
            });
        }

        var hint = this.item.find('> .hint');
        var hintCount = hint.length;

        if (hintCount) {
            var currentHint = 0;
            // convert to 0-based indexing
            hintCount = hintCount - 1;

            var buttonHint = this.item.find('button.hint');
            buttonHint.show();
            buttonHint.off('click');
            buttonHint.click(function (e) {
                e.preventDefault();
                $(hint[currentHint]).show();
                if (currentHint < hintCount) {
                    // change label to 'next hint'
                    if (buttonHint.find('> .next-hint-label').length) {
                       buttonHint.find('> .next-hint-label').show();
                       buttonHint.find('> .hint-label').hide();
                    }
                    currentHint++;
                } else {
                    buttonHint.find('> .next-hint-label').hide();
                    buttonHint.find('> .hint-label').show();
                    buttonHint.hide();
                }
            });
        } else {
            this.clearHint();
        }
    };

    RandomExercise.prototype.clearFeedback = function () {
        this.item.find('> .feedback').hide();
    };

    RandomExercise.prototype.showFeedback = function (correct) {
        this.clearFeedback();
        this.item.find('> .feedback:not(.correct,.incorrect)').show();
        var feedbackClass = (correct ? 'correct' : 'incorrect');
        this.item.find('> .feedback.' + feedbackClass).show();
    };

    RandomExercise.prototype.clearChecked = function () {
        this.answers.find('input').prop('checked', false);
    };

    RandomExercise.prototype.clearMarks = function () {
        this.answers.removeClass('correct incorrect');
        this.answers.find('.image-container, .quote').removeClass('correct incorrect');
    };

    RandomExercise.prototype.handleNewExample = function () {
        var exercise = this;
        this.item.find('button.recreate').show();
        this.item.find('button.recreate').off('click');
        this.item.find('button.recreate').click(function (e) {
            e.preventDefault();
            exercise.clear(true);
            var newSet = exercise.randomize();
            exercise.handleCheckAnswer(newSet);
            if (exercise._hasWomi) {
                womi.resizeAll();
            }
        });
    };

    RandomExercise.prototype.handleCheckAnswer = function (answerSet) {
        var exercise = this;
        this.item.find('button.check').show();
        this.item.find('button.check').off('click');
        this.item.find('button.check').click(function (e) {
            e.preventDefault();
            if (exercise.type == 'single-response') {
                if (1 === $(answerSet).find('input:checked').length) {
                    exercise.setClearOnInputs(answerSet);
                    exercise.checkAnswers(answerSet);
                }
            } else if (exercise.presentationStyle == 'true-false') {
                if (answerSet.length === $(answerSet).find('input:checked').length) {
                    exercise.setClearOnInputs(answerSet);
                    exercise.checkAnswers(answerSet);
                }
            } else {
                exercise.checkAnswers(answerSet);
            }
        });
    };

    RandomExercise.prototype.checkAnswers = function (set) {
        var exercise = this;
        var correctIds = this.correctIdsInSet(set);
        var checkedIds = this.checkedIdsInSet(set);
        var resultCorrect = true;

        _.each(correctIds, function (c) {
            if (! _.contains(checkedIds, c)) {
                resultCorrect = false;
            }
        });
        if (this.type != 'single-response') {
            var wrongIds = this.wrongIdsInSet(set);
            _.each(wrongIds, function (c) {
                if ((exercise.type == 'multiple-response')
                    && (exercise.presentationStyle == 'true-false')) {
                    if (! _.contains(checkedIds, c)) {
                        resultCorrect = false;
                    }
                } else {
                    if (_.contains(checkedIds, c)) {
                        resultCorrect = false;
                    }
                }
            });
        }
        if (!resultCorrect) {
            var checked = (this.type == 'single-response') ? checkedIds[0] : undefined;
            this.showHint(checked);
        }

        if ((this.type == 'single-response')
            && (this.presentationStyle != 'true-false')) {
            this.markAnswers(resultCorrect, checkedIds);
        }
        this.showFeedback(resultCorrect);
    };

    RandomExercise.prototype.setClearOnInputs = function (set) {
        var exercise = this;
        $(set).find('input').click(function () {
            exercise.clear(false);
            $(set).find('input').off('click');
        });
    };

    RandomExercise.prototype.correctIdsInSet = function (set) {
        var exercise = this;
        var correct = _.filter(set, function (answer) {
            return answer.getAttribute('data-correct') == 'true';
        });
        var inputIds = $(correct).find('input').map(function (i, input) {
            return input.id;
        });
        if (exercise.presentationStyle == 'true-false') {
            return _.filter(inputIds, function (input) {
                return (input.search(/-true$/) !== -1);
            });
        } else {
            return inputIds;
        }
    };

    RandomExercise.prototype.wrongIdsInSet = function (set) {
        var exercise = this;
        var correct = _.filter(set, function (answer) {
            return answer.getAttribute('data-correct') == 'false';
        });
        var inputIds = $(correct).find('input').map(function (i, input) {
            return input.id;
        });
        if (exercise.presentationStyle == 'true-false') {
            return _.filter(inputIds, function (input) {
                return (input.search(/-false$/) !== -1);
            });
        } else {
            return inputIds;
        }
    };

    RandomExercise.prototype.checkedIdsInSet = function (set) {
        var inputs = $(set).find('input');
        var checked = _.filter(inputs, function(input) {
            return input.checked;
        });
        return _.map(checked, function (input) {
            return input.id;
        });
    };

    RandomExercise.prototype.markAnswers = function (correct, checkedIds) {
        var answerClass = (correct ? 'correct' : 'incorrect');
        _.each(checkedIds, function (answer) {
            $('#' + answer).parent().addClass(answerClass);
            $('#' + answer).siblings('label').find('.image-container, .quote').addClass(answerClass);
        });
    };

    RandomExercise.prototype.randomizeInputs = function (inSet) {
        var exercise = this;
        var answersRandomized;
        if (inSet) {
            inSet = $(inSet);
            answersRandomized = inSet.sort(function() {
                return (Math.round(Math.random())-0.5);
            });

            var answerHeader = $(inSet).prev('.set-header');
            this.item.find('.answers-container .set-header').hide();
            inSet.remove();

            answerHeader.show();
            answerHeader.after(answersRandomized);
        } else {
            answersRandomized = this.answers.sort(function() {
                return (Math.round(Math.random())-0.5);
            });

            this.answers.remove();
            this.answers = $(answersRandomized);
            var form = this.item.find('> form');
            this.answers.each(function (i, answer) {
                if (exercise.presentationStyle == 'true-false') {
                    form.find('.answers-container .set-header').after(answer);
                } else {
                    form.prepend(answer);
                }
            });
        }
    };

    function RandomizeAnswersExercise(exercise) {
        RandomExercise.call(this, exercise);

        var _this = this;
        this.presentedAnswers = this.item.find('form').data('presentedAnswers');
        this.correctRange = this.item.find('form').data('correctInSet') || '1-1';
        if (this.correctRange.toString().indexOf('-') == -1) {
            this.correctRange = [ this.correctRange, this.correctRange ];
        } else {
            this.correctRange = this.correctRange.split('-');
        }
        this.correctRange = _.map(this.correctRange, function (r) {
            return parseInt(r, 10);
        });

        if (this.correctRange[0] > this.correctRange[1]) {
            console.log('Niewłaściwy przedział poprawnych odpowiedzi w zadaniu ' + exercise.id);
            this.disable();
            return;
        }

        this.correctAnswers = [];
        this.wrongAnswers = [];
        this.answers.each(function (i, answer) {
            if (answer.getAttribute('data-correct') == 'true') {
                _this.correctAnswers.push(answer);
            } else {
                _this.wrongAnswers.push(answer);
            }
        });
        if (this.correctAnswers.length < this.correctRange[1]) {
            console.log('Zbyt mała ilość zdefiniowanych poprawnych odpowiedzi w zadaniu ' + exercise.id);
            this.disable();
            return;
        }

        this.randomize();

        this.handleNewExample();

        this.handleCheckAnswer(this.randomSet);

        this.handleAnswerHints();

        this.clear(true);
    }

    $.extend(RandomizeAnswersExercise.prototype, RandomExercise.prototype, {
        randomInRange: function (min, max) {
            if (min == max) {
                return min;
            } else {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        },
        randomize: function () {
            this.correctInSet = this.randomInRange(this.correctRange[0], this.correctRange[1]);

            this.answers.hide();

            this.randomSet = [];
            var rIndex;

            var correctIndexes = [];
            while (correctIndexes.length < this.correctInSet) {
                rIndex = this.randomInRange(0, _.size(this.correctAnswers) - 1);
                if (_.contains(correctIndexes, rIndex)) {
                    continue;
                }
                $(this.correctAnswers[rIndex]).show();
                this.randomSet.push(this.correctAnswers[rIndex]);
                correctIndexes.push(rIndex);
            }

            var wrongCount = this.presentedAnswers - this.correctInSet;
            var wrongIndexes = [];
            while (wrongIndexes.length < wrongCount) {
                rIndex = this.randomInRange(0, _.size(this.wrongAnswers) - 1);
                if (_.contains(wrongIndexes, rIndex)) {
                    continue;
                }
                $(this.wrongAnswers[rIndex]).show();
                this.randomSet.push(this.wrongAnswers[rIndex]);
                wrongIndexes.push(rIndex);
            }

            this.randomizeInputs();

            return this.randomSet;
        }
    });

    function RandomizeSetsExercise(exercise) {
        RandomExercise.call(this, exercise);

        var _this = this;
        this.sets = {};
        this.activeSet = 1;
        this.answers.each(function (i, answer) {
            var setNo = answer.getAttribute('data-in-set');
            if (_this.sets[setNo] === undefined) {
                _this.sets[setNo] = [ answer ];
            } else {
                _this.sets[setNo].push(answer);
            }
        });
        
        this.randomize();

        this.handleNewExample();

        this.handleCheckAnswer(this.sets[this.activeSet]);

        this.handleAnswerHints();

        this.clear(true);
    }

    $.extend(RandomizeSetsExercise.prototype, RandomExercise.prototype, {
        showSetAnswers: function () {
            this.answers.hide();
            $(this.sets[this.activeSet]).each(function (i, answer) {
                $(answer).show();
            });
        },
        randomize: function () {
            var exercise = this;
            var randSetIndex = Math.floor(Math.random() * _.size(exercise.sets) + 1);
            this.activeSet = randSetIndex;

            this.randomizeInputs(this.sets[this.activeSet]);

            this.showSetAnswers();

            return this.sets[this.activeSet];
        }
    });

    function AllSetsExercise(exercise) {
        RandomExercise.call(this, exercise);

        var _this = this;

        this.sets = {};
        this.answers.each(function (i, answer) {
            var setNo = answer.getAttribute('data-in-set');
            if (_this.sets[setNo] === undefined) {
                _this.sets[setNo] = [ answer ];
            } else {
                _this.sets[setNo].push(answer);
            }
        });
//        this.handleCheckAnswer(this.sets[this.activeSet]);
        this.handleCheckAllAnswers();

        this.handleAnswerHints();

        this.clear(true);
    }

    $.extend(AllSetsExercise.prototype, RandomExercise.prototype, {
        handleCheckAllAnswers: function() {
            var exercise = this;
            this.item.find('button.check').show();
            this.item.find('button.check').off('click');
            this.item.find('button.check').click(function (e) {
                e.preventDefault();
                exercise.setClearOnInputs(exercise.answers);
                if (exercise.type == 'single-response') {
                    // an input must be checked in all sets
                    var allSet = true;
                    _.each(exercise.sets, function (set) {
                        set = $(set);
                        if (!set.find('input:checked').length) {
                            allSet = false;
                        }
                    });
                    if (allSet) {
                        exercise.checkAllAnswers();
                    }
                } else {
                    exercise.checkAllAnswers();
                }
            });
        },
        checkAllAnswers: function() {
            var exercise = this;
            var allCorrect = true;

            _.each(this.sets, function (set) {
                var correctIds = exercise.correctIdsInSet(set);
                var checkedIds = exercise.checkedIdsInSet(set);
                var resultCorrect = true;

                _.each(correctIds, function (c) {
                    if (! _.contains(checkedIds, c)) {
                        resultCorrect = false;
                    }
                });

                if (resultCorrect && (exercise.type != 'single-response')) {
                    var wrongIds = exercise.wrongIdsInSet(set);
                    _.each(wrongIds, function (c) {
                        if ((exercise.type == 'multiple-response')
                            && (exercise.presentationStyle == 'true-false')) {
                            if (! _.contains(checkedIds, c)) {
                                resultCorrect = false;
                            }
                        } else {
                            if (_.contains(checkedIds, c)) {
                                resultCorrect = false;
                            }
                        }
                    });
                }

                if (!resultCorrect) {
                    allCorrect = false;
                }

                if ((exercise.type == 'single-response')
                    && (exercise.presentationStyle != 'true-false')) {
                    exercise.markAnswers(resultCorrect, checkedIds);
                }
            });

            if (!allCorrect) {
                this.showHint();
            }
            this.showFeedback(allCorrect);
        }
    });

    function loadRandomExercises() {
        $('.exercise.dynamic').each(function (i, element) {
            var behaviour = $(element).find('.qmlitem').data('behaviour');

            var e = undefined;
            switch (behaviour) {
            case 'randomize':
                e = new RandomizeAnswersExercise(element);
                break;
            case 'randomize-sets':
                e = new RandomizeSetsExercise(element);
                break;
            case 'all-sets':
                e = new AllSetsExercise(element);
                break;
            }
        });
    }

		return {
        loadRandomExercises: loadRandomExercises
		};
});
