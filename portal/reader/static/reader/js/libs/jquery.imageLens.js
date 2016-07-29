/*  
    http://www.dailycoding.com/ 
*/
define(['jquery'], function(jquery){
(function ($) {
    $.fn.imageLens = function (options) {

        if(options == 'delete'){
            return this.each(function () {
                  var _this = $(this);
                  if(_this.data('target')){
                      _this.data('target').remove();
                  }
            });
        }

        var defaults = {
            lensSize: 100,
            borderSize: 4,
            borderColor: "#888"
        };
        var options = $.extend(defaults, options);
        var lensStyle = "background-position: 0px 0px;width: " + String(options.lensSize) + "px;height: " + String(options.lensSize)
            + "px;float: left;display: none;border-radius: " + String(options.lensSize / 2 + options.borderSize)
            + "px;border: " + String(options.borderSize) + "px solid " + options.borderColor 
            + ";background-repeat: no-repeat;position: absolute;";

        return this.each(function () {
            var obj = $(this);

            var offset = $(this).offset();
            var _this = $(this);

            // Creating lens
            var target = $("<div style='" + lensStyle + "' class='" + options.lensCss + "'>&nbsp;</div>").appendTo($("body"));
            var targetSize = target.size();

            obj.data('target', target);
            // Calculating actual size of image
            var imageSrc = options.imageSrc ? options.imageSrc : $(this).attr("src");
            var img = new Image();
            var zoomFactor = 1;
            img.onload = function(){
                zoomFactor = Math.max((this.height / obj.height()),
                (this.width / obj.width()));
            };
            img.src = imageSrc;

            target.css({ backgroundImage: "url('" + imageSrc + "')" });

            obj.on("remove", function () {
                target.remove();
            });

            target.mousemove(setPosition);
            $(this).mousemove(setPosition);
            target.mouseout(hideLens)
            $(this).mouseout(hideLens)
            $(window).scroll(hideLens);

            function hideLens() {
            target.hide();
            }

            function setPosition(e) {
                offset = _this.offset();
                var leftPos = parseInt(e.pageX - offset.left);
                var topPos = parseInt(e.pageY - offset.top);
                if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
                    target.hide();
                }
                else {
                    target.show();
                    leftPos = String(((e.pageX - offset.left) * zoomFactor - target.width() / 2) * (-1));
                    topPos = String(((e.pageY - offset.top) * zoomFactor - target.height() / 2) * (-1));
                    target.css({ backgroundPosition: leftPos + 'px ' + topPos + 'px' });

                    leftPos = String(e.pageX - target.width() / 2);
                    topPos = String(e.pageY - target.height() / 2);
                    target.css({ left: leftPos + 'px', top: topPos + 'px' });
                }
            }
        });
    };
})(jquery);
});