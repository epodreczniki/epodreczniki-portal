({
    baseUrl: '../.',
    name: 'components/locks',
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
            name: 'lock_driver',
            location: '../../../../editcommon/static/editcommon/js/components/lock_driver',
            main: 'LockDriver'
        }
    ]
})