define(['jquery'], function (jquery) {

    epGlobal.reader = epGlobal.reader || {};

    epGlobal.reader.pl = epGlobal.reader.pl || {};

    epGlobal.reader.pl.interactiveExercisePL = (function ($) {
        'use strict';


        function generateInteractive() {

            $(".interactiveSelect").each(function () {
                $(this).html(generateSelect($(this).attr("data-inStart"), $(this).attr("data-inStop")));
            })

            $(".hearts").each(function () {
                $(this).html(hearts($(this).attr("data-redX"), $(this).attr("data-hY"), $(this).attr("data-greenX")));
            })

            $("#d130e68").find("input").keydown(function (e) {
                if (e.which == 13) { // Checks for the enter key

                    $("#checkButton10").trigger("click");
                    e.preventDefault(); // Stops IE from triggering the button to be clicked
                }
            });
        }


        //p4_r01_T4mnozeniePamieciowe_z01

        var a = 6;
        var b = 7;
        var prevA = 6;
        var prevB = 7;


        function Mod1set01() {

            var str = "<select onChange=\"epGlobal.reader.pl.quizGeneratorPL.dimList(this," + a * b + ",2)\">";
            str += "<option selected> </option>";
            for (i = 1; i <= 100; i++)
                str += "<option>" + i + "</option>";
            str += "</select>";

            var prevId = "z01" + prevA + "" + prevB;
            var id = "z01" + a + "" + b;

            var rowId = "z01row" + a;
            var colId = "z01col" + b;
            var prevRowId = "z01row" + prevA;
            var prevColID = "z01col" + prevB;

            if (prevA % 2)
                document.getElementById(prevId).style.backgroundColor = "#ffffff";
            else
                document.getElementById(prevId).style.backgroundColor = "#efefef";
            document.getElementById(prevRowId).style.backgroundColor = "#3399ff";
            document.getElementById(prevColID).style.backgroundColor = "#3399ff";

            document.getElementById(id).innerHTML = str;
            document.getElementById(id).style.backgroundColor = "#3366CC";
            document.getElementById(rowId).style.backgroundColor = "#3366CC";
            document.getElementById(colId).style.backgroundColor = "#3366CC";
            document.getElementById(prevId).innerHTML = prevA * prevB;

        }

        function generate01() {

            prevA = a;
            prevB = b;

            a = _rand(1, 10);
            b = _rand(1, 10);

            Mod1set01();
        }

        function setDefault01() {

            if (a == 6 && b == 7)
                return;
            prevA = a;
            prevB = b;
            a = 6;
            b = 7;
            Mod1set01();
        }


        //p4_r01_T4mnozeniePamieciowe_z04

        function generateSelect(first, last) {

            var str = "";
            str += "<option select> </option>";
            for (i = first; i <= last; i++)
                str += "<option>" + i + "</option>";

            return str;
        }


        //p4_r01_T6porownywanieIlorazowe_z01


        var ans01 = [4, 2, 5, 3];
        var questCounter01 = 1;
        var maxQuest01 = ans01.length;

        function set01(elem) {

            var parent = elem.parentNode;

            var str = "";
            var style = "";

            str += "<img src=\"p4_r01_T6porownywanieIlorazowe_z02" + questCounter01
                + ".svg\" alt=\"Por&#243;wnywanie Ilorazowe - zadanie 3.1 - obrazek " + questCounter01 + "\">";

            for (i = 1; i <= maxQuest01; i++)
                if (i == questCounter01) {
                    document.getElementById("counter01" + i).style.borderStyle = "solid";
                    document.getElementById("counter01" + i).style.borderWidth = "thin";
                }
                else
                    document.getElementById("counter01" + i).style.borderStyle = "none";

            $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");

            document.getElementById("img01").innerHTML = str;
            document.getElementById("list01").selectedIndex = 0;
            //document.getElementById("feedback01").innerHTML = "";
            document.getElementById("list01").style.backgroundColor = epGlobal.reader.pl.quizGeneratorPL.defaultColor;
        }


        function check01(elem) {

            var parent = elem.parentNode;//$(elem).parent().parent();

            var userAnswer = document.getElementById("list01").selectedIndex;
            var str;
            var txtColor;
            var counterColor;


            if (userAnswer == 0) {
                str = "Odpowied&#378; jest niekompletna";
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.incomplete").html(str)
                return;
            }


            if (userAnswer == ans01[questCounter01 - 1]) {
                str = "Prawid&#322;owo!";
                str += "</div>"
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.correct").html(str);

                txtColor = epGlobal.reader.pl.quizGeneratorPL.okColor;
                counterColor = epGlobal.reader.pl.quizGeneratorPL.okColor;

            }
            else {
                str = "Nieprawid&#322;owo.";
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.incorrect").html(str);
                txtColor = epGlobal.reader.pl.quizGeneratorPL.wrongColor;
                counterColor = epGlobal.reader.pl.quizGeneratorPL.wrongColor;

            }

            //document.getElementById("feedback01").innerHTML = str;
            document.getElementById("list01").style.backgroundColor = txtColor;
            document.getElementById("counter01" + questCounter01).style.backgroundColor = counterColor;

        }

        function next01(elem) {
            if (questCounter01 < maxQuest01)
                questCounter01++;
            set01(elem);
            if (questCounter01 == maxQuest01)
                document.getElementById("next01").disabled = true;
            document.getElementById("prev01").disabled = false;
        }

        function prev01(elem) {
            if (questCounter01 > 1)
                questCounter01--;
            set01(elem);
            if (questCounter01 == 1)
                document.getElementById("prev01").disabled = true;
            document.getElementById("next01").disabled = false;
        }


        //p4_r01_T6porownywanieIlorazowe_z03

        //empty

        //p4_r01_T6porownywanieIlorazowe_z07


        function hearts(redx, hy, greenx) {
            var str;
            str = "<p>";
            for (var i = 1; i <= redx; i++) {
                for (var j = 1; j <= hy; j++)
                    str += "<img src='redHeart.svg' alt='Czerwone serduszko'> ";
                if (i != redx)
                    str += "<br>";
            }
            str += "</p><p>";
            for (i = 1; i <= greenx; i++) {
                for (j = 1; j <= hy; j++)
                    str += "<img src='greenHeart.svg' alt='Zielone serduszko'> ";
                if (i != greenx)
                    str += "<br>";
            }
            str += "<br>";
            str += "<img src='hrHearts.svg' alt='Separator poziomy'>";
            str += "</p>";
            //document.write(str);
            return str;
        }


        //p4_r01_T6porownywanieIlorazowe_z09

        //empty

        //p4_r01_T6porownywanieIlorazowe_z10

        var ans10 = 9;
        var wrongAtt10 = 0;

        //sprawdzenie, czy jest ca&#322;kowita nieujemna
        function isNato(str) {
            var pattern = /[^0-9]/;

            //usunięcie ewentualnych spacji
            str = str.replace(/[ ]{1,}/, "");

            return str.match(pattern);
        }

        function set10(elem, a, b, num) {

            var parent = elem.parentNode;

            $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
            $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
            $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");

            document.getElementById("checkButton10").disabled = false;

            wrongAtt10 = 0;
            var str = "";

            switch (num) {
                case 1:
                    str += "Liczba ";
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " jest &nbsp;<input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">";
                    str += "&nbsp; razy mniejsza od liczby ";
                    str += _beginMath();
                    str += _mn(b);
                    str += ".";
                    break;
                case 2:
                    str += "Liczba";
                    str += " &nbsp;<input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">";
                    str += "&nbsp; jest ";
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " razy mniejsza od liczby ";
                    str += _beginMath();
                    str += _mn(b);
                    str += _endMath();
                    str += ".";
                    break;
                case 3:
                    str += "Liczba "
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " jest ";
                    str += _beginMath();
                    str += _mn(b);
                    str += _endMath();
                    str += " razy mniejsza od liczby &nbsp;";
                    str += "<input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">.";
                    break;
                case 4:
                    str += "Liczba &nbsp;";
                    str += "<input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">";
                    str += "&nbsp; jest ";
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " razy większa od liczby ";
                    str += _beginMath();
                    str += _mn(b);
                    str += _endMath();
                    str += ".";
                    break;
                case 5:
                    str += "Liczba ";
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " jest";
                    str += "&nbsp; <input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">";
                    str += "&nbsp; razy większa od liczby ";
                    str += _beginMath();
                    str += _mn(b);
                    str += _endMath();
                    str += ".";
                    break;
                case 6:
                    str += "Liczba ";
                    str += _beginMath();
                    str += _mn(a);
                    str += _endMath();
                    str += " jest ";
                    str += _beginMath();
                    str += _mn(b);
                    str += _endMath();
                    str += " razy większa od liczby &nbsp;";
                    str += "<input type=\"text\" title=\"Miejsce na twoj&#261; odpowied&#378;\" id=\"txt10\" maxlength=\"3\" size=\"3\">";
                    str += ".";
                    break;
            }

            document.getElementById("exer10").innerHTML = str;
            document.getElementById("txt10").value = "";

            $(parent.parentNode).find("input").keydown(function (e) {
                if (e.which == 13) { // Checks for the enter key

                    $("#checkButton10").trigger("click");
                    e.preventDefault(); // Stops IE from triggering the button to be clicked
                }
            });
            //document.getElementById("feedback10").innerHTML = "";
        }


        function check10(elem) {

            var parent = elem.parentNode;
            var userAnswer = document.getElementById("txt10").value;
            var str;
            var txtColor;

            if (userAnswer == "") {
                str = "<div class=\"info-answer\">Odpowied&#378; jest niekompletna. </div>";
                //document.getElementById("feedback10").innerHTML = str;
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.incomplete").html(str)
                //document.getElementById("txt10").style.backgroundColor = epGlobal.reader.pl.quizGeneratorPL.noInputColor;
                return;
            }

            if (isNato(userAnswer)) {
                str = "<div class=\"info-answer\">To nie jest poprawnie wpisana liczba.</div>";
                //document.getElementById("feedback10").innerHTML = str;
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.incomplete").html(str)
                //document.getElementById("txt10").style.backgroundColor = epGlobal.reader.pl.quizGeneratorPL.noInputColor;
                return;
            }

            if (parseInt(userAnswer) == ans10) {
                str = "<div class=\"correct-answer\">Prawid&#322;owo!</div>";
                txtColor = epGlobal.reader.pl.quizGeneratorPL.okColor;
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.correct").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.correct").html(str)

            }
            else {
                wrongAtt10++;
                str = "<div class=\"wrong-answer\">Nieprawid&#322;owo.</div>";
                txtColor = epGlobal.reader.pl.quizGeneratorPL.wrongColor;


                if (wrongAtt10 == 3) {
                    str += "<br>Prawid&#322;owa odpowied&#378; to: ";
                    str += _beginMath();
                    str += _mn(ans10);
                    str += _endMath();
                    str += "</div>";
                    document.getElementById("txt10").disabled = true;
                    elem.disabled = true;
                }
                else {
                    str += "</div>";
                }

                $(parent).find(".feedback.correct-incorrect.correct").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incomplete").css("display", "none");
                $(parent).find(".feedback.correct-incorrect.incorrect").css("display", "block");
                $(parent).find(".feedback.correct-incorrect.incorrect").html(str)

            }

            //document.getElementById("feedback10").innerHTML = str;
            document.getElementById("txt10").style.backgroundColor = txtColor;

        }


        function generate10(elem) {

            var num = _rand(1, 6);
            var a, b;

            switch (num) {
                case 1:
                    a = _rand(1, 10);
                    ans10 = _rand(2, 10);
                    b = a * ans10;
                    break;
                case 2:
                    a = _rand(2, 10);
                    ans10 = _rand(1, 10);
                    b = a * ans10;
                    break;
                case 3:
                    a = _rand(1, 10);
                    b = _rand(2, 10);
                    ans10 = a * b;
                    break;
                case 4:
                    a = _rand(2, 10);
                    b = _rand(1, 10);
                    ans10 = a * b;
                    break;
                case 5:
                    b = _rand(1, 10);
                    ans10 = _rand(2, 10);
                    a = b * ans10;
                    break;
                case 6:
                    b = _rand(2, 10);
                    ans10 = _rand(1, 10);
                    a = b * ans10;
                    break;
            }

            set10(elem, a, b, num);
        }

        function setDefault10(elem) {

            ans10 = 9;
            set10(elem, 6, 54, 1);
        }

        //math.js (internal usage only)
        //losowa liczba calkowita z zakresu minN...maxN
        function _rand(minN, maxN) {
            return Math.floor(Math.random() * (maxN - minN + 1)) + minN;
        }

        //najwieksza wartosc z tablicy Arr
        function _max(Arr) {

            var m = Arr[0];
            var n = Arr.length;

            for (i = 1; i < n; i++)
                if (Arr[i] > m)
                    m = Arr[i];

            return m;
        }

        //najmniejsza wartosc z tablicy Arr
        function _min(Arr) {

            var m = Arr[0];
            var n = Arr.length;

            for (i = 1; i < n; i++)
                if (Arr[i] < m)
                    m = Arr[i];

            return m;
        }

        //najwiekszy wspólny dzielnik
        function _NWD(m, n) {

            if (m == n)
                return m;
            if (m == 0)
                return n;
            if (n == 0)
                return m;

            var temp, k;
            if (m < n) {
                temp = n;
                n = m;
                m = temp;
            }

            do {
                k = m % n;
                m = n;
                n = k;
            }
            while (k);

            return m;
        }

        function fraction(l, m) {

            if (m * l > 0)
                this.sign = 1;
            if (m * l < 0)
                this.sign = -1;
            if (m * l == 0)
                this.sign = 0;

            this.num = l;
            if (m)
                this.den = m;
            else
                this.den = 1;

            this.simp = simp;
            function simp() {
                this.num = Math.abs(this.num);
                this.den = Math.abs(this.den);
                var k = _NWD(this.num, this.den);
                this.num /= k;
                this.den /= k;
            }
        }

        //mathML.js (internal usage only)
        //TODO verify this ... thing

        //otwarcie mathml
        function _beginMath() {
            return "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">";
        }

        //zamkniecie mathml
        function _endMath() {
            return "</math>";
        }

        //operator
        function _mo(o) {
            var str = "<mo>" + o + "</mo>";
            return str;
        }

        //zmienna
        function _mi(s) {
            var str = "<mi>" + s + "</mi>";
            return str;
        }

        //liczba
        function _mn(n) {
            var str = "<mn>" + n + "</mn>";
            return str;
        }

        //ulamek
        function _frac(li, mn) {
            var str = "<mfrac>";
            str += "<mrow>" + li + "</mrow>";
            str += "<mrow>" + mn + "</mrow>";
            str += "</mfrac>";
            return str;
        }

        //pierwiastek kwadratowy
        function _sqrt(base) {
            var str = "<msqrt>";
            str += "<mrow>" + base + "</mrow>";
            str += "</msqrt>";
            return str;
        }


        //pierwiastek stopnia n
        function _root(base, index) {
            var str = "<mroot>";
            str += "<mrow>" + base + "</mrow>";
            str += "<mrow>" + index + "</mrow>";
            str += "</mroot>";
            return str;
        }

        //indeks dolny
        function _sub(base, subscript) {
            var str = "<msub>";
            str += "<mrow>" + base + "</mrow>";
            str += "<mrow>" + subscript + "</mrow>";
            str += "</msub>";
            return str;
        }

        //indeks górny
        function _sup(base, superscript) {
            var str = "<msup>";
            str += "<mrow>" + base + "</mrow>";
            str += "<mrow>" + superscript + "</mrow>";
            str += "</msup>";
            return str;
        }

        //indeks dolny i górny
        function _subsup(base, subscript, superscript) {
            var str = "<msubsup>";
            str += "<mrow>" + base + "</mrow>";
            str += "<mrow>" + subscript + "</mrow>";
            str += "<mrow>" + superscript + "</mrow>";
            str += "</msubsup>";
            return str;

        }

        function _text(txt) {
            var str = "<mtext>" + txt + "</mtext>";
            return str;
        }

        //TODO - end of verify

        return {
            generate01: generate01,
            setDefault01: setDefault01,
            check01: check01,
            prev01: prev01,
            next01: next01,
            setDefault10: setDefault10,
            check10: check10,
            generate10: generate10,
            generateInteractive: generateInteractive

        }

    })(jquery);
});