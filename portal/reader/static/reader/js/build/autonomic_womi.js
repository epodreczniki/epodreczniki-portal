({
    baseUrl: '../.',
    name: 'modules/autonomic_womi',
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
    findNestedDependencies: false
})