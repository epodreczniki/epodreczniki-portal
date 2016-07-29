({
    baseUrl: '../.',
    name: 'modules/reader_womi_preview',
    exclude: ['modules/common', 'jquery'],
    pragmas: {
        staticExclude: false
    },
    paths: {
        tocUtils: 'modules/layouts/default/utils/toc'
    },
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/core/womi'
        },
        {
            name: 'selectedLayout',
            location: 'modules/layouts/womi_render',
            main: 'WomiPreviewLayout'
        }
    ]
})
