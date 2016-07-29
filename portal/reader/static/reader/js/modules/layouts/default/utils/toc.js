define(['jquery', 'underscore'], function($, _) {

    var activeModule = function() {
        return $('#table-of-contents')
            .find('a.module-a.link-active')
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
    };

    return {
        activeModule: activeModule
    };

});
