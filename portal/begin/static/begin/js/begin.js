
require(['search_box', 'jquery', 'EpoAuth'], function(search_box, $, EpoAuth){
    //search_box.init();

    EpoAuth.connectToPage($('.top-right-nav'), false);

    EpoAuth.ping();
});
