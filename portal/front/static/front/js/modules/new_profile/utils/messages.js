define(['jquery'], function ($) {
    var link = 'http://soundcli.ps/download/1703.mp3';

    var snd = new Audio(link);

    var msgs = [
        {
            who: 'Janek Nowak',
            msg: 'Hej, co było zadane z matmy?'
        },
        {
            who: 'Alicja Janicka',
            msg: 'Cześć! Pomożesz mi w tym zataniu z geografii?'
        },
        {
            who: 'Patryk W',
            msg: 'Mam do Ciebie prośbę, przyniesiesz mi jutro swój zeszyt od biologii?'
        },
        {
            who: 'Janek Nowak',
            msg: 'to znowu ja, nie masz przypadkiem mojego zeszytu z polskiego?'
        }

    ];

    var tpl = '<div class="message-item"><div class="message-sender"></div><p class="message-text"></p></div>';

    var initial = 0;

    function flicker(mc) {
        var n = 0;
        var f = function () {
            mc.toggleClass('flick');
            if (n++ < 20) {
                setTimeout(f, 300);
            } else {
                mc.removeClass('flick');
            }
        };
        setTimeout(f, 300);
    }

    function addMsg(msg) {
        var mc = $('.messages-count');

        mc.text(++initial);
        flicker(mc);

        snd.src = link;
        //snd.play();

        var m = $(tpl);
        m.find('.message-sender').text(msg.who);
        m.find('.message-text').text(msg.msg);
        $('.messages-box').append(m);
    }

    function init() {

        var btn = $('.messages');
        var box = $('.messages-box');
        btn.click(function(){
             box.animate({height: 'toggle'});
        });


        addMsg(msgs[(initial + 1) % msgs.length]);

        $(document).keydown(function (e) {
            if (e.keyCode == 77) {
                addMsg(msgs[(initial + 1) % msgs.length]);
            }
        });
    }

    return init;
});