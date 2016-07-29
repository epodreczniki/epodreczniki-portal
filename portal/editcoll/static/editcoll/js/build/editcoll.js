({
    baseUrl: '../.',
    name: 'modules/editcoll',
    exclude: ['modules/common'],
    findNestedDependencies: true,
    paths: {
        'aci_plugin': 'plugins/jquery.aciPlugin.min',
        'aci_sortable': 'plugins/jquery.aciSortable.min',
        'aci_tree': 'plugins/jquery.aciTree.min',
        'dateFormat': 'plugins/dateFormat',
        operandScheme: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/helpers/operandScheme',
        ResultsView: '../../../../editcommon/static/editcommon/js/components/resources_lister/filters/views/BaseResults'
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
        },
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
            name: 'xml_parser',
            location: '../../../../editcommon/static/editcommon/js/components/xml_parser',
            main: 'XMLParser'
        },
        {
            name: 'CascadeForms',
            location: '../../../../editcommon/static/editcommon/js/components/cascade_forms',
            main: 'CascadeForms'
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
