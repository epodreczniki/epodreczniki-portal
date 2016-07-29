({
    baseUrl: '../../.',
    name: 'modules/test/reader',
    paths: {
        'sets': 'modules/test/test_sets',
        tocUtils: 'modules/layouts/default/utils/toc'
    },
    shim: {
        'mocha': {
            exports: 'mocha'
        }
    },
    exclude: ['modules/common', 'modules/reader', 'jquery', 'require'],
    findNestedDependencies: false,
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/core/womi'
        }
    ]
})