({
    baseUrl: '../.',
    name: 'modules/common',
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    exclude: ['jquery'],
    findNestedDependencies: false
})
