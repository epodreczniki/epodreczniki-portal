({
    baseUrl: '../.',
    name: 'modules/common',
    exclude: ['jquery'],
    include: ['domReady', 'text', 'underscore', 'backbone', 'declare'],
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore','jquery'],
            exports: 'Backbone'
        }
    }
})
