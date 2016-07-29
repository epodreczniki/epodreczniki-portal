({
    baseUrl: '../.',
    name: 'components/womi_dialog',
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
    packages: [
        {
            name: 'womi_dialog',
            location: '../../../../editcommon/static/editcommon/js/components/womi_dialog',
            main: 'WOMISelectDialog'
        },
        {
            name: 'base_dialog',
            location: '../../../../editcommon/static/editcommon/js/components/dialog',
            main: 'Dialog'
        }
    ]
})