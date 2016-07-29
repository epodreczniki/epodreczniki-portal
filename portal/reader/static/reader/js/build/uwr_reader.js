({
    baseUrl: '../.',
    name: 'modules/reader',
    exclude: ['modules/common', 'jquery'],
    pragmas: {
        staticExclude: false
    },
    paths: {
        load: 'modules/loaders/uwrLoad',
        tocUtils: 'modules/layouts/uwr/utils/toc'
    },
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/layouts/uwr/womi'
        }
    ]

    //findNestedDependencies: false,
    //removeCombined: true
})