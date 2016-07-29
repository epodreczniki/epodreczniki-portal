({
    baseUrl: '../.',
    name: 'components/resources_lister',
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
    paths: {
        //operandScheme: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers/operandScheme',
        operandScheme: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers/operandScheme',
        ResultsView: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/views/BaseResults'
    },
    packages: [
        {
            name: 'base_lister',
            location: '../../../../editcommon/static/editcommon/js/components/resources_lister',
            main: 'BaseLister'
        },
        {
            name: 'helpers',
            location: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers'
        }
    ]
})
