({
    baseUrl: '../.',
    name: 'modules/edittext',
    findNestedDependencies: false,
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
        },
        {
            name: 'object_driver',
            location: '../../../../editcommon/static/editcommon/js/components/object_driver',
            main: 'ObjectDriver'
        },
        {
            name: 'editor_driver',
            location: '../../../../editcommon/static/editcommon/js/components/editor_driver',
            main: 'EditorDriver'
        },
        {
            name: 'bar_editor_driver',
            location: '../../../../editcommon/static/editcommon/js/components/bar_editor_driver',
            main: 'BarEditorDriver'
        },
        {
            name: 'standard_extensions',
            location: '../../../../editcommon/static/editcommon/js/components/standard_extensions',
            main: 'StandardExtensions'
        }
    ]
})
