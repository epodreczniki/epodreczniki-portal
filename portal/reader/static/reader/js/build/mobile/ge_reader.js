({
    baseUrl: '../../.',

    pragmas: {
        staticExclude: false,
        staticInclude: true
    },
    paths: {
        load: 'modules/loaders/geLoad',
        tocUtils: 'modules/layouts/default/utils/toc'
    },
    packages: [
        {
            name: 'layoutWomiPath',
            location: 'modules/layouts/ge/womi'
        }
    ],
    //skipDirOptimize: true,
    optimize: 'none',
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
    optimizeAllPluginResources: true

    //findNestedDependencies: false,
    //removeCombined: true
})