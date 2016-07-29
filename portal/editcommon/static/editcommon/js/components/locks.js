require(['jquery',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json',
    'components/lock_driver/LockDriver'], function () {
    'use strict';
    var Lock = arguments[9];
    var lock = new Lock({category: 'collection', identifier: '30636', version: '1'});

    lock.onOk(function(data){
        console.log(data);
    });

    window.mylock = lock;

    lock.watch(function(data){
        //console.log(data);
    });

});