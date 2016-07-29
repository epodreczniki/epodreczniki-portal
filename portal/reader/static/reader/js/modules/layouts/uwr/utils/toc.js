define(['jquery', 'underscore'], function($, _) {

    var activeModule = function() {
        return $('#table-of-contents').find('a.module-a.link-active').attr('data-raw-title').trim();
    };

    return {
        activeModule: activeModule
    };

});
