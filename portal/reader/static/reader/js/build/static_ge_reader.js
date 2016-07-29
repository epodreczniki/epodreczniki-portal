({
    baseUrl: '../.',
    name: 'modules/reader',
    exclude: ['modules/common', 'jquery'],
    pragmas: {
        staticExclude: false,
        staticInclude: false
    },
    paths: {
        load: 'modules/loaders/staticGeLoad',
        tocUtils: 'modules/layouts/default/utils/toc'
    },
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/layouts/ge/womi'
        }
    ]

    //findNestedDependencies: false,
    //removeCombined: true
})