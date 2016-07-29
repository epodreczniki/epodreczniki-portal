    define(['jquery'],function($){


    var scrollingObject =  function(scrollableObject, velocity, start_from) {

        //settings to pass to function
        this.scroller = scrollableObject; // element(s) to scroll
        var scrolling_velocity = velocity; // 1-99
        var scrolling_from = start_from; // 'right' or 'left'

        this.animateText = function(scroller_obj, velocity, start_from) {
            scroller_obj.bind('marquee', function (event, c) {
                //text to scroll
                var ob = scroller_obj;//$(this);

                //measure width of element and its parent
                var sw = parseInt(ob.parent().width());
                var tw = parseInt(ob.width());

                tw = tw - 10;

                //text left position relative to the offset parent
                var tl = parseInt(ob.position().left);

                //velocity converted to calculate duration
                var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
                //duration
                var dr = (v * tw / sw) + v;

                switch (start_from) {
                    case 'right':
                        if (typeof c == 'undefined') {
                            // start from the absolute right
                            ob.css({
                                left: (sw - 10)
                            });
                            sw = -tw;
                        } else {
                            //calculate destination position
                            sw = tl - (tw + sw);
                        };
                        break;
                    default:
                        if (typeof c == 'undefined') {
                            //start from the absolute left
                            ob.css({
                                left: -tw
                            });
                        } else {
                            // calculate destination position
                            sw += tl + tw;
                        };
                }
                //attach animation to scroller element
                ob.animate({
                    left: sw
                }, {
                    duration: dr,
                    easing: 'linear',
                    complete: function () {
                        ob.trigger('marquee');
                    },
                    step: function () {
                        // check if scroller limits are reached
                        if (start_from == 'right') {
                            if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                                ob.stop();
                                ob.trigger('marquee');
                            };
                        } else {
                            if (parseInt(ob.position().left) > parseInt(ob.parent().width())) {
                                ob.stop();
                                ob.trigger('marquee');
                            };
                        };
                    }
                });
            }).trigger('marquee');
            //pause scrolling animation on mouse over
            scroller_obj.mouseover(function () {
                $(this).stop();
            });
            //resume scrolling animation on mouse out
            scroller_obj.mouseout(function () {
                $(this).trigger('marquee', ['resume']);
            });

        };//end of animateText

        this.startAnimation = function(){
             this.animateText(this.scroller, scrolling_velocity, scrolling_from);
        };//end of startAnimation

        this.stopAnimation = function(scroller_obj){
            scroller_obj.stop();
        };//end of stopAnimation;

        this.resumeAnimation = function(){ alert('Resume animation');};//end of resumeAnimation

        this.performChanges = function(scroller_obj){

            this.stopAnimation(scroller_obj);

            var textwidth = 0;//to measure

            $.fn.textWidth = function(text, font) {
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
            return $.fn.textWidth.fakeEl.width();
            }

            textwidth = scroller_obj.textWidth();
            //alert("Width: " + textwidth + " " + scroller_obj.html());

            var scrollerwidth = scroller_obj.outerWidth();
           // alert(scrollerwidth + "," + textwidth);

           if(textwidth >= scrollerwidth){
                this.startAnimation(scroller_obj, scrolling_velocity, scrolling_from);
            }

            this.stopAnimation(scroller_obj);

        }; //end of performChanges
    };//end of var scrollingObject

        return scrollingObject;

    });//end of module scrolling