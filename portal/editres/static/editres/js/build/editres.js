({
    baseUrl: '../.',
    name: 'components/editres',
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
        },
        velocity: {
            deps: ['jquery']
        },
        velocityui: {
            deps: ['velocity']
        }
    },
    paths: {
        operandScheme: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers/operandScheme',
        ResultsView: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/views/BaseResults'
    },
    packages: [
        {
            name: 'editres',
            location: '../../../../editres/static/editres/js/components/editres',
            main: 'Editres'
        },
        {
            name: 'ResLister',
            location: '../../../../editcommon/static/editcommon/js/components/resources_lister',
            main: 'BaseLister'
        },
        {
            name: 'base_lister',
            location: '../../../../editcommon/static/editcommon/js/components/resources_lister',
            main: 'BaseLister'
        },
        {
            name: 'helpers',
            location: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers'
        },
        {
            name: 'CascadeForms',
            location: '../../../../editcommon/static/editcommon/js/components/cascade_forms',
            main: 'CascadeForms'
        },
        {
            name: 'universal_logout',
            location: '../../../../common/static/common/js',
            main: 'universal_logout'
        }
    ]
})
