({
    baseUrl: '../.',
    name: 'begin',
    exclude: ['jquery'],
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
