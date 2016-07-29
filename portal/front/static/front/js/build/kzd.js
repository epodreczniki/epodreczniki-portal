({
    baseUrl: '../.',
    name: 'modules/kzd',
    exclude: ['modules/common'],
    paths: {
        operandScheme: 'modules/kzd/operandScheme',
        ResultsView: 'modules/kzd/KzdResults'
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
