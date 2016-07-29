    $(document).ready(function() {
        $('.tabs').each(function() {
            var $ul = $(this);
            var $li = $ul.children('li');
            $li.each(function() {
                var $tabContent = $($(this).children('a').attr('href'));
                if ($(this).hasClass('active')) {
                    $tabContent.show();
                } else {
                    $tabContent.hide();
                }
            });
                     
            $li.click(function() {$(this).children('a').click()});
            $li.children('a').click(function() {
                $li.removeClass('active');
                $li.each(function() {
                    $($(this).children('a').attr('href')).hide();
                });
                $(this).parent().addClass('active');
                $($(this).attr('href')).show();
                return false;
            });
        });
}); 