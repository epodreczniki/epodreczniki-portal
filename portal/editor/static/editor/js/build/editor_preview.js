({
    baseUrl: '../.',
    name: 'modules/editor_preview',
    exclude: ['modules/common'],
    findNestedDependencies: true,
    paths: {
        'aci_plugin': 'plugins/jquery.aciPlugin.min',
        'aci_tree': 'plugins/jquery.aciTree.min',
        'dateFormat': 'plugins/dateFormat'
    }
})
