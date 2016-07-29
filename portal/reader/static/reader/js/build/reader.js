({
    baseUrl: '../.',
    name: 'modules/reader',
    exclude: ['modules/common', 'jquery'],
    pragmas: {
        staticExclude: false,
        staticInclude: false
    },
    paths: {
        load: 'modules/loaders/defaultLoad',
        tocUtils: 'modules/layouts/default/utils/toc'
    },
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/core/womi'
        }
    ]

    //findNestedDependencies: false,
    //removeCombined: true
})
