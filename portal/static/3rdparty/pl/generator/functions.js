//MathJax.Hub.Register.MessageHook("End Process",function(){
//MathJax.Hub.Queue(["Reprocess",MathJax.Hub.getAllJax()[0]])()
define(['jquery'], function (jquery) {
    epGlobal = epGlobal || {};
    epGlobal.reader = epGlobal.reader || {};

    epGlobal.reader.pl = epGlobal.reader.pl || {};

    epGlobal.reader.pl.quizGeneratorPL = (function ($) {
        'use strict';


        //former settings.js #################################
        var wrongColor = "#f7ccd0";
        var okColor = "#d6f0ba";
        var okWrongColor = "#FFFF99";
        var defaultColor = "#ffffff";
        var noInputColor = "#0099ee";


        //różne teksty
        var okMsg = ["Prawidłowo!"];
        var okWrongStr = "Twoja odpowiedź jest tylko częściowo poprawna. ";
        var wrongMsg = ["Nieprawidłowo."];
        var wrongInputTypeMsg = "Odpowiedź zawiera niedozwolone znaki";
        var emptyInputMsg = "Odpowiedź jest niekompletna";


        function dimList(list, pos, sec) {

            if (list.selectedIndex == pos)
                list.style.backgroundColor = okColor;
            else {
                list.style.backgroundColor = wrongColor;
                setTimeout(function () {
                    list.style.backgroundColor = defaultColor;
                    list.selectedIndex = 0;
                }, sec * 1000);
            }
        }


        function autoList(list, pos, sec) {

            if (list.selectedIndex == pos)
                list.style.backgroundColor = okColor;
            else {
                list.style.backgroundColor = wrongColor;
                setTimeout(function () {
                    list.selectedIndex = pos;
                    list.style.backgroundColor = okColor;
                }, sec * 1000);
            }
        }

        function registerSingleAnswerQuestions() {
            $(".generated-exercise").each(function () {
                $(this).find("input[type='text']").css("width", "50px");
                var t = $(this);

                $(this).find("input").keydown(function (e) {
                    if (e.which == 13) { // Checks for the enter key
                        checkSingleRadio(t);
                        e.preventDefault(); // Stops IE from triggering the button to be clicked
                    }
                });

                $(this).find("mn:contains('$')").each(function () {
                    var expression = $(this).text();
                    $(this).attr("data-expression", expression);
                });

                $(this).find(".check").click(function () {
                    checkSingleRadio(t);
                });
                $(this).find(".regenerate").click(function () {
                    regenerate(t, false);
                });
                $(this).find(".restore-defaults").click(function () {
                    regenerate(t, true);
                });


                replaceExpressions(t, true)

            })
        }


        function replaceExpressions(elem, dflt) {
            var values = [];
            $(elem).find(".variable").each(function () {
                if (dflt) {
                    values[$(this).attr("data-name")] = parseFloat($(this).attr("data-default"))
                } else {
                    values[$(this).attr("data-name")] = pickRandom(parseFloat($(this).attr("data-start")), parseFloat($(this).attr("data-end")), parseFloat($(this).attr("data-step")))
                }
            });
            for (var i in values) {
                $(elem).find("mn:contains('$" + i + "')").each(function () {
                    var text = $(this).attr("data-expression");
                    for (var j in values) text = text.replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j])
                    $(this).html(eval(text))
                });
                $(elem).find("script[type='math/mml']").each(function () {
                    var parsed = $(epGlobal.jQuery.parseHTML($(this).text()));
                    parsed.find("mn[data-expression]").each(function () {
                        var text = $(this).attr("data-expression");
                        for (var j in values) text = text.replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j])
                        var evaluated = eval(text);
                        $(this).text(evaluated);


                    });

                    $(".tmp").html(parsed);
                    $(this).text($(".tmp").html())
                });

                $(elem).find("span.correctanswer[data-expression]").each(function () {
                    var text = $(this).attr("data-expression");
                    for (var j in values) text = text.replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j]).replace('$' + j, values[j])
                    $(this).attr("data-value", eval(text))
                })
            }
        }

        function resortList(elem) {
            var items = $(elem).find("li");
            if (items != undefined && items != null) {
                for (var i = 0; i < items.length; i++) {
                    var r = Math.floor(Math.random() * items.length);
                    $(elem).append(items.eq(r))
                }
            }

        }

        function checkSingleRadio(elem) {
            var allCorrect = true;
            var error = false;
            var empty = false;
            var hasGroups = false;
            var groups = [];
            $(elem).find("span.correctanswer").each(function () {
                if ($(this).attr("group") != undefined && $(this).attr("group") != false) {
                    if (groups[$(this).attr("group")] == undefined) groups[$(this).attr("group")] = [];
                    groups[$(this).attr("group")][$(this).attr("data-key")] = false;
                    hasGroups = true;
                }

                var input = $(elem).find("input[name='" + $(this).attr("data-key") + "']");
                if ($(input).attr("type") == "radio") {
                    var checked = $(elem).find("input[name='" + $(this).attr("data-key") + "']:checked").val();
                    if (allCorrect && checked != "undefined" && checked == $(this).attr("data-value")) allCorrect = true;
                    else allCorrect = false;
                    if (checked == undefined) error = true
                } else if ($(input).attr("type") == "text") {
                    try {
                        if (allCorrect && Math.round(eval($(input).val().replace(",", ".")) * 10000) / 10000 == $(this).attr("data-value")) {
                            allCorrect = true;
                        } else {
                            allCorrect = false;
                        }
                    } catch (e) {
                        error = true;
                    }

                    if ($(input).val() == "") empty = true;
                }
            });

            if (hasGroups) {
                allCorrect = true;
                for (var group in groups) {
                    var groupCorrect = true;
                    $("span.correctanswer[group='" + group + "']").each(function () {
                        var found = false;
                        for (var key in groups[group]) {
                            if ($("input[name='" + key + "']").val() == $(this).attr("data-value")) found = true;
                        }
                        if (!found) groupCorrect = false;
                    });
                    if (!groupCorrect) allCorrect = false
                }
            }

            if (error) {
                showWrongInput(elem)
            } else if (empty) {
                showNoAnswer(elem)
            } else {
                if (allCorrect) showCorrect(elem);
                else showIncorrect(elem)
            }
        }


        function showCorrect(elem) {
            $(elem).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incomplete").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.correct").css("display", "block");
            $(elem).find(".feedback.correct-incorrect.correct").html(okMsg[Math.floor(Math.random() * okMsg.length)])

        }

        function showIncorrect(elem) {
            $(elem).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incomplete").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incorrect").css("display", "block");
            $(elem).find(".feedback.correct-incorrect.incorrect").html(wrongMsg[Math.floor(Math.random() * wrongMsg.length)])
        }

        function showNoAnswer(elem) {
            $(elem).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incomplete").css("display", "block");
            $(elem).find(".feedback.correct-incorrect.incomplete").html(emptyInputMsg)
        }

        function showWrongInput(elem) {
            $(elem).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incomplete").css("display", "block");
            $(elem).find(".feedback.correct-incorrect.incomplete").html(wrongInputTypeMsg)
        }

        function regenerate(elem, dflt) {
            $(elem).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(elem).find(".feedback.correct-incorrect.incomplete").css("display", "none");
            $(elem).find("input[type='text']").val('');
            $(elem).find("input[type='radio']").prop("checked", false);
            replaceExpressions(elem, dflt);

            randSort(elem, dflt);

            //MathJax.Hub.Queue(["Typeset",MathJax.Hub, $(elem).attr("id")]);

            MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $(elem).attr("id")]);

            //I can't even express how non-optimal and slow it was...
            //$(elem).find(".MathJax").each(function(){
            //if ($(this).attr("id")) MathJax.Hub.Queue(["Reprocess",MathJax.Hub.getJaxFor($(this).attr("id"))])
            //})
        }

        function pickRandom(from, to, step) {
            var numbers = generateRandom(from, to, step);
            return numbers[Math.floor(Math.random() * numbers.length)]
        }

        function generateRandom(from, to, step) {
            var ret = [];
            if (step == null) step = 1;
            for (var i = from; i <= to; i += step) ret.push(i)
            return ret
        }

        function randSort(elem, dflt) {
            var items = $(elem).find("ul").find("li")
            if (items != undefined && items != null) {

                var first = items.first();

                //find Yes or No question
                if (first.find("input").length == 2) {
                    reIndex(items, dflt, 2);
                } else if (first.find("input").length == 1) {

                    //single-answer question
                    if (first.has("input:radio").length == 1) {
                        reIndex(items, dflt, 1);
                    }
                    //open question
                    else if (first.has("input:text").length == 1) {
                        //Do nothing (we don't want to rearrange open questions)
                    }
                    else {
                        //some kind of error - this shouldn't happened
                    }
                }

            }
        }


        function reIndex(items, dflt, type) {

            if (dflt && type == 1) {
                items.tsort('input', {attr: 'value'})
            } else if (dflt && type == 2) {
                items.tsort('input', {attr: 'name'})
            } else {
                items.tsort({order: 'rand'});
            }

            //After removing this part all old collections will nat behave "properly"
            /*items[0].innerHTML = items[0].innerHTML.replace(RegExp("[A-D]{1}\. "),"A. ");
             items[1].innerHTML = items[1].innerHTML.replace(RegExp("[A-D]{1}\. "),"B. ");
             items[2].innerHTML = items[2].innerHTML.replace(RegExp("[A-D]{1}\. "),"C. ");
             items[3].innerHTML = items[3].innerHTML.replace(RegExp("[A-D]{1}\. "),"D. ");*/

        }

        function setCharAt(str, index, chr) {
            if (index > str.length - 1) return str;
            return str.substr(0, index) + chr + str.substr(index + 1);
        }


        return {
            registerSingleAnswerQuestions: registerSingleAnswerQuestions,
            dimList: dimList,
            autoList: autoList,
            okColor: okColor,
            defaultColor: defaultColor,
            wrongColor: wrongColor,
            okWrongColor: okWrongColor,
            noInputColor: noInputColor,
            wrongMsg: wrongMsg
        }
    })(jquery);

});