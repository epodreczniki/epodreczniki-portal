({
    baseUrl: '../.',
    name: 'modules/editor',
    exclude: ['modules/common'],
    findNestedDependencies: true,
    paths: {
        'aci_plugin': 'plugins/jquery.aciPlugin.min',
        'aci_tree': 'plugins/jquery.aciTree.min',
        'blockUI': 'plugins/jquery.blockUI',
        'dateFormat': 'plugins/dateFormat',
        'operandScheme': '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers/operandScheme',
        'ResultsView': '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/views/BaseResults'
 
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
        },
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
