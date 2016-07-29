require(['require', 'chai', 'mocha', 'sets/reader/basic'], function (require, chai, mocha, basic) {
    var $ = require('jquery');
    // Chai
    var should = chai.should();
    /*globals mocha */
    mocha.setup({
        ui: 'bdd',
        reporter: 'html',
        ignoreLeaks: true
    });
        basic.start();
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        }
        else {
            mocha.run();
        }
       $('#mocha-stats').css('position', 'static');

});