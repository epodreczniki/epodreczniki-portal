(function ($) {

    var TAGS = [
        {
            name: 'val',
            replaceElement: '<tt>'
        },
        {
            name: 'exval',
            replaceElement: '<tt>'
        }
    ];

    function tagParser() {
        $('table').find('td').each(function(){
           var _this = $(this);
            var html = _this.text();


        });
    }

    $(document).ready(function () {
        var snip = JSON.parse($('#snippet').text());
        $('#snippet').text(JSON.stringify(snip, null, 4));
        prettyPrint();
    });

})(jQuery);
